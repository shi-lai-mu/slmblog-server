import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { Article } from "../../../entity/article.entity";
import { UserEntity } from "src/modules/user/entity/user.entity";
import { ArticleLove } from "../../comment/entity/comment.love.entity";

import { RedisService } from "src/modules/coreModules/redis/redis.service";

import { ArticleNS } from "../../../type/article";
import { LoveLogDto } from "../dto/behavior.dto";
import { ResponseBody } from "src/constants/response";
import { ArticleLoveStatus, ArticleLoveTarget } from "../../../constants/entity.cfg";
import { ArticleResponse } from "../../../constants/response.cfg";
import { ArticleComment } from "../../comment/entity/comment.entity";



/**
 * 文章业务 行为 逻辑层
 */
@Injectable()
export class ArticleBehaviorService {
  
    constructor(
      private readonly RedisService: RedisService,
      @InjectRepository(Article) private readonly Article: Repository<Article>,
      @InjectRepository(ArticleLove) private readonly ArticleLove: Repository<ArticleLove>,
      @InjectRepository(ArticleComment) private readonly ArticleComment: Repository<ArticleComment>,
    ) {}

  
    /**
     * 提交用户行为 对评论 点赞/点踩
     * @param loveLog 踩赞行为
     * @param user    行为用户
     */
    async doLoveCheckLog(loveLog: LoveLogDto, user: UserEntity) {
      const { articleId, loveType, target } = loveLog;
      const targetId = target === ArticleLoveTarget.Article ? 0 : loveLog.targetId;
      const userId = user.id;
      const [ check ]: null | ArticleNS.LoveIdList[] = await this.RedisService.hmGetItem(
        'articleComment',
        String(articleId),
        String(targetId),
      );
      const [ dbId, _loveId, checkPraise, checkCriticism ] = check || [];
      // 当前文章一点踩赞用户id
      const loveIds: ArticleNS.LoveIdList = [ 0, targetId, [], [] ];
      // 当前用户对文章的踩赞状态
      const loveState: ArticleNS.LoveState = {
        praise: false,
        criticism: false,
      }
      const [, , lPraise, lCriticism ] = loveIds;

      // 如果在redis中未找到 则进行缓存
      if (!dbId) {
        const findArticle = await this.Article.findOne({ id: articleId });
        const findLove = await this.ArticleLove.findOne({
          article: articleId,
          targetId,
        });
        
        if (!findArticle) {
          ResponseBody.throw(ArticleResponse.STATE_NOT_EXISTS);
        } else if (findLove) {
          lPraise
            ? lPraise.push(userId)
            : lCriticism.push(userId)
          loveIds[0] = findLove.id;
        } else if (targetId) {
          const findComment = await this.ArticleComment.findOne(targetId);
          if (!findComment) {
            ResponseBody.throw(ArticleResponse.LIKE_COMMENT_INVALID);
          }
        }
      } else {
        // 如果redis缓存中存在点赞的信息则进行追加
        lPraise.push(...checkPraise);
        lCriticism.push(...checkCriticism);
        loveIds[0] = dbId;
      }
      loveState.praise = lPraise.findIndex(v => v === userId) + 1;
      loveState.criticism = lCriticism.findIndex(v => v === userId) + 1;
  
      // 读取最新状态
      const { praise, criticism } = loveState;
  
      // 重复进行踩赞操作判断
      // if ((praise && loveType === ArticleLoveStatus.Praise) || (criticism && loveType === ArticleLoveStatus.Criticism)) {
      //   ResponseBody.throw(ArticleResponse.REPEAT_LOVE_ACTION);
      // }
      
      // 如果之前 踩/赞 过
      if (praise || criticism) {
        // 互换踩赞
        if (praise) {
          lPraise.splice(praise - 1, 1);
          if (loveType === ArticleLoveStatus.Criticism) lCriticism.push(userId);
        } else {
          lCriticism.splice(praise - 1, 1);
          if( loveType === ArticleLoveStatus.Praise) lPraise.push(userId);
        }
      } else {
        loveType === ArticleLoveStatus.Criticism
          ? lCriticism.push(userId)
          : lPraise.push(userId)
        ;
      }

      // 如果是最新插入则不需要加入到缓存更新列队
      if (!loveIds[0]) {
        // 最新的行为 进行插入
        const insertData = await new ArticleLove({
          article: articleId,
          targetId: targetId,
          praise: lPraise.length,
          criticism: lCriticism.length,
          json: JSON.stringify([
            0,
            targetId,
            lPraise,
            lCriticism,
          ]),
        })
        .save();

        if (insertData.id) {
          loveIds[0] = insertData.id;
        }
      } else {
        this.RedisService.hmSetItem(
          'articleComment', 
          'update',
          `${articleId}:${targetId}`,
          '',
        );
      }

      // 更新缓存
      if (loveIds) {
        this.RedisService.hmSetItem(
          'articleComment', 
          String(articleId),
          String(targetId),
          JSON.stringify(loveIds),
        );
      }

      return {
        state: {
          praise: lPraise.length,
          criticism: lCriticism.length,
        },
        // list: loveIds,
      };
    }


    /**
     * 存储Redis缓存数据
     */
    async saveRedisData() {
      let keyList = await this.RedisService.hmGetItem('articleComment', 'update');
      const updateData: ArticleNS.LoveIdList[] = [];
      const articleList: { [k: string]: string[] } = {};
      Object.keys(keyList).map(key => {
        const [ articleId, targetId ] = key.split(':');
        articleList[articleId] = articleList[articleId] || [];
        articleList[articleId].push(targetId);
      });

      for (const articleId of Object.keys(articleList)) {
        const targetIds = articleList[articleId];
        const cache = await this.RedisService.hmGetItem<ArticleNS.LoveIdList[]>(
          'articleComment',
          articleId,
          ...targetIds,
        );
        cache.forEach(loveItem => {
          updateData.push(loveItem);
        });
      }

      // 开始入库
      if (updateData.length) {
        this.ArticleLove.save(
          updateData.map(([ id, targetId, praise, criticism ]) => ({
            id,
            targetId,
            praise: praise.length,
            criticism: criticism.length,
            json: JSON.stringify([ id, targetId, praise, criticism ]),
          })),
        );
      }

      // 清空更新列队
      this.RedisService.del('articleComment', 'update');
    }
  }
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ResponseBody } from "src/constants/response";
import { RedisService } from "src/modules/coreModules/redis/redis.service";
import { User } from "src/modules/user/entity/user.entity";
import { DeepPartial, Repository } from "typeorm";
import { ArticleLoveStatus } from "../constants/entity.cfg";
import { ArticleResponse } from "../constants/response.cfg";
import { LoveLogDto } from "../dto/comment.dto";
import { Article } from "../entity/article.entity";
import { ArticleComment } from "../entity/comment.entity";
import { ArticleLove } from "../entity/comment.love.entity";
import { ArticleCommentNS } from "../type/comment";

/**
 * 文章业务 评论 逻辑层
 */
@Injectable()
export class ArticleCommentService {

  constructor(
    private readonly RedisService: RedisService,
    @InjectRepository(Article) private readonly Article: Repository<Article>,
    @InjectRepository(ArticleComment) private readonly ArticleComment: Repository<ArticleComment>,
    @InjectRepository(ArticleLove) private readonly ArticleLove: Repository<ArticleLove>,
  ) {}

  /**
   * 提交用户行为 对评论 点赞/点踩
   * @param loveLog 踩赞行为
   * @param user    行为用户
   */
  async doLoveCheckLog(loveLog: LoveLogDto, user: User) {
    await this.saveRedisData();
    const { articleId, loveType, target } = loveLog;
    const userId = user.id;
    const key = `${articleId}-${target}`;
    const checkExists: null | ArticleCommentNS.LoveIdList = await this.RedisService.getItem('articleComment', key);
    // 当前文章一点踩赞用户id
    const loveIds: ArticleCommentNS.LoveIdList = {
      praise: [],
      criticism: [],
      update: false,
      dbId: 0,
    };
    // 当前用户对文章的踩赞状态
    const loveState: ArticleCommentNS.LoveState = {
      praise: false,
      criticism: false,
    }
    const { praise: Lpraise, criticism: Lcriticism } = loveIds;
    
    if (!checkExists) {
      const findArticle = await this.Article.findOne({ id: articleId });
      const findLove = await this.ArticleLove.findOne({ article: articleId, target });
      
      if (!findArticle) {
        ResponseBody.throw(ArticleResponse.STATE_NOT_EXISTS);
      } else if (findLove) {
        Lpraise
          ? Lpraise.push(userId)
          : Lcriticism.push(userId)
        loveIds.dbId = findLove.id;
      }
    } else {
      Lpraise.push(...checkExists.praise);
      Lcriticism.push(...checkExists.criticism);
      loveIds.dbId = checkExists.dbId;
    }
    loveState.praise = Lpraise.findIndex(v => v === userId) + 1;
    loveState.criticism = Lcriticism.findIndex(v => v === userId) + 1;

    // 读取最新状态
    const { praise, criticism } = loveState;

    // 重复进行踩赞操作判断
    if ((praise && loveType === ArticleLoveStatus.Praise) || (criticism && loveType === ArticleLoveStatus.Criticism)) {
      ResponseBody.throw(ArticleResponse.REPEAT_LOVE_ACTION);
    }
    if (praise || criticism) {
      // 互换踩赞
      if (praise) {
        Lpraise.splice(praise - 1, 1);
        Lcriticism.push(userId);
      } else {
        Lcriticism.splice(praise - 1, 1);
        Lpraise.push(userId);
      }
    } else {
      // 最新的行为 进行插入
      const insertData = await new ArticleLove({
        target,
        article: articleId,
        praise: Lpraise.length,
        criticism: Lcriticism.length,
        json: JSON.stringify({
          praise: Lpraise,
          criticism: Lcriticism,
        }),
      })
      .save();

      if (insertData.id) {
        loveIds.dbId = insertData.id;
        if (loveType === ArticleLoveStatus.Praise) {
          loveIds.praise.push(userId);
        } else {
          loveIds.criticism.push(userId);
        }
      }
    }

    // 缓存更新
    if (loveIds) {
      // 将用户ID添加入更新列队
      loveIds.update = true;
      // 异常数据过滤
      this.RedisService.setItem('articleComment', key, loveIds);
    }

    delete loveIds.update;
    delete loveIds.dbId;
    return {
      state: loveState,
      list: loveIds,
    };
  }


  /**
   * 存储Redis缓存数据
   */
  async saveRedisData() {
    let keyList = await this.RedisService.keys('*', 'articleComment');
    const indexs = keyList.map(key => key.match(/\d+\-\d+$/)[0]);
    const updateData: Array<{ index: string; data: ArticleCommentNS.LoveIdList }> = [];

    for (const index of indexs) {
      const cache = await this.RedisService.getItem<ArticleCommentNS.LoveIdList>('articleComment', index);
      if (cache && cache.update) {
        updateData.push({
          index,
          data: cache,
        });
      }
    }

    if (updateData.length) {
      const saveData = await this.ArticleLove.save<DeepPartial<ArticleLove | null>>(
        updateData
        .map(item => {
          const { data, index } = item;
          const [ article, target ] = index.split('-');
          const { dbId, criticism, praise } = data;

          if (!dbId) return null;

          return {
            id: dbId,
            article: Number(article),
            target: Number(target),
            praise: praise.length,
            criticism: criticism.length,
            json: JSON.stringify({ criticism, praise }),
          }
        })
        .filter(v => !!v)
      );

      // TODO: 判断数据是否全量存储，如果数量不相等则不进行清除
      if (saveData.length === updateData.length) {
        for (const check of updateData) {
          check.data.update = false;
          await this.RedisService.setItem('articleComment', check.index, check.data);
        }
      }
    }
  }
}
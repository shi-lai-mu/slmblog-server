import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ResponseBody } from "src/constants/response";
import { RedisService } from "src/modules/redis/redis.service";
import { User } from "src/modules/user/entity/user.entity";
import { Repository } from "typeorm";
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
  async doCheckLog(loveLog: LoveLogDto, user: User) {
    const { articleId, loveType, target } = loveLog;
    const userId = user.id;
    const key = `${articleId}-${target}`;
    const checkExists: null | ArticleCommentNS.LoveIdList = await this.RedisService.getItem('articleComment', key);
    // 当前文章一点踩赞用户id
    const loveIds: ArticleCommentNS.LoveIdList = {
      praise: [],
      criticism: [],
    };
    // 当前用户对文章的踩赞状态
    const loveState: ArticleCommentNS.LoveState = {
      praise: false,
      criticism: false,
    }
    
    if (!checkExists) {
      const findArticle = await this.Article.findOne({ id: articleId });
      console.log({findArticle});
      
      if (!findArticle) {
        ResponseBody.throw(ArticleResponse.STATE_NOT_EXISTS);
      }
      const loveList = await this.ArticleLove.find({ article: articleId });
      if (loveList.length) {
        loveList.forEach(log => {
          log.status === ArticleLoveStatus.Praise
            ? loveIds.praise.push(log.user)
            : loveIds.criticism.push(log.user)
        });
      }
    } else {
      loveIds.praise.push(...checkExists.praise);
      loveIds.criticism.push(...checkExists.criticism);
    }
    loveState.praise = loveIds.praise.findIndex(v => v === userId) + 1;
    loveState.criticism = loveIds.criticism.findIndex(v => v === userId) + 1;

    // 读取最新状态
    const { praise, criticism } = loveState;

    // 重复进行踩赞操作判断
    if ((praise && loveType === ArticleLoveStatus.Praise) || (criticism && loveType === ArticleLoveStatus.Criticism)) {
      ResponseBody.throw(ArticleResponse.REPEAT_LOVE_ACTION);
    }
    if (praise || criticism) {
      // 互换踩赞
      if (praise) {
        loveIds.praise.splice(praise - 1, 1);
        loveIds.criticism.push(userId);
      } else {
        loveIds.criticism.splice(praise - 1, 1);
        loveIds.praise.push(userId);
      }
    } else {
      // 最新的行为 进行插入
      const insertData = await new ArticleLove({
        target,
        status: loveType,
        article: articleId,
        user: userId,
      }).save();

      if (insertData.id) {
        if (loveType === ArticleLoveStatus.Praise) {
          loveIds.praise.push(userId);
        } else {
          loveIds.criticism.push(userId);
        }
      }
    }

    // 缓存更新
    if (loveIds) {
      // 异常数据过滤
      Object.keys(loveIds).forEach(key => loveIds[key] = loveIds[key].filter(v => !!v));
      this.RedisService.setItem('articleComment', key, loveIds, 'EX');
    }

    return {
      state: loveState,
      list: loveIds,
    };
  }
}
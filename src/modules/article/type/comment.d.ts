import { User } from "src/modules/user/entity/user.entity";
import { ArticleLoveStatus, ArticleLoveTarget } from "../constants/entity.cfg";
import { Article } from "../entity/article.entity";

/**
 * 文章业务 评论 接口
 */
export namespace ArticleCommentNS {
  /**
   * 踩赞状态ID表
   */
  export interface LoveIdList {
    /**
     * 赞ID列表
     */
    praise: number[];
    /**
     * 踩ID列表
     */
    criticism: number[];
  }

  /**
   * 踩赞状态
   */
  export interface LoveState {
    /**
     * 赞状态
     */
    praise: false | number;
    /**
     * 踩状态
     */
    criticism: false | number;
  }

  /**
   * 创建文章评论点赞状态
   */
  export interface CreateArticleLove {
    /**
     * 踩赞用户ID
     */
    user: User['id'];
    /**
     * 踩赞文章
     */
    article: Article['id'];
    /**
     * 踩赞状态
     */
    status: ArticleLoveStatus;
    /**
     * 行为目标
     */
    target: ArticleLoveTarget;
  }
}
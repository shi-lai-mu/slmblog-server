import { Article } from "../entity/article.entity";

import { ArticleLoveTarget } from "../constants/entity.cfg";



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
    /**
     * 是否已更新
     */
    update: boolean;
    /**
     * 数据库记录ID
     */
    dbId: number;
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
     * 踩赞文章
     */
    article: Article['id'];
    /**
     * 行为目标
     */
    target: ArticleLoveTarget;
    /**
     * 踩赞ids
     */
    json: string;
    /**
     * 点赞人数
     */
    praise: number;
    /**
     * 点踩人数
     */
    criticism: number;
  }
}
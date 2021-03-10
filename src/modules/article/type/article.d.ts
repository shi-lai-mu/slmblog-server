import { Article } from "src/modules/article/entity/article.entity"
import { ArticleStat } from "src/modules/article/entity/stat.entity";

import { ArticleLoveTarget } from "../constants/entity.cfg";
import { ArticleComment } from "../entity/comment.entity";



/**
 * 文章
 */
export namespace ArticleNS {

  /**
   * 文章基础数据
   */
  export type BaseData = Article;


  /**
   * 文章列表
   */
  export interface List extends Article {
    stat: ArticleStat;
  }


  /**
   * 完整的文章数据
   * - 文章基础数据
   * - 评论
   */
  export interface Information {
    /***
     * 文章数据
     */
    article: Article;
    /**
     * 评论数据
     */
    comment: {
      /**
       * 评论列表
       */
      list: ArticleComment[],
      /**
       * 评论总数
       */
      total: number;
    };
  }


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
   * 创建 文章/评论 点赞
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
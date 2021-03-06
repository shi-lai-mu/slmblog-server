import { ArticleStat } from "../modules/comment/entity/stat.entity";
import { ArticleComment } from "../modules/comment/entity/comment.entity";
import { Article } from "src/modules/article/entity/article.entity"

import { ArticleLoveTarget } from "../constants/entity.cfg";



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
  export type LoveIdList = [
    /**
     * 数据库记录ID
     */
    number,
    /**
     * 状态ID
     */
    number,
    /**
     * 赞ID列表
     */
    number[],
    /**
     * 踩ID列表
     */
    number[],
    /**
     * 是否已更新
     */
    // update: boolean;
    /**
     * 数据库记录ID
     */
  ]


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
     * 行为类型 (1: 文章， 2: 评论)
     */
    // target: ArticleLoveTarget;
    /**
     * 行为目标 文章ID/评论ID
     */
    targetId: ArticleLoveTarget;
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
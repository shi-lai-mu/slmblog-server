import { Article } from "src/modules/article/entity/article.entity"
import { ArticleStat } from "src/modules/article/entity/stat.entity";



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
    comment: [];
  }
}
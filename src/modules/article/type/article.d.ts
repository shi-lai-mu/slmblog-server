import { Article } from "src/entity/article.entity"

/**
 * 文章
 */
export namespace ArticleNS {

  /**
   * 文章基础数据
   */
  export type BaseData = Article;


  /**
   * 完整的文章数据
   * - 文章基础数据
   * - 评论
   */
  export interface Information {
    article: Article;
    comment: [];
  }
}
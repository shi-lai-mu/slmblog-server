import { User } from "src/modules/user/entity/user.entity";
import { ArticleCategory } from "../entity/categorys.entity";

/**
 * 定位ID入参
 */
export type FindIdsParams = ArticleCategory['id'] | ArticleCategory['id'][] | string;

/**
 * 文章类目接口
 */
export namespace ArticleCategoryNS {

  
  /**
   * 创建类目入参
   */
  export interface CreateCategory {
    /**
     * 类目ID
     */
    names: ArticleCategory['names'];
    /**
     * 类目父级ID
     */
    parentId: ArticleCategory['parentId'];
    /**
     * 指向链接
     */
    link?: ArticleCategory['link'];
    /**
     * 创建用户ID
     */
    create_user_id: User['id'];
  }


  /**
   * 响应类目列表
   */
  export interface ResponseList {
    /**
     * 类目Id
     */
    id: ArticleCategory['id'];
    /**
     * 类目名
     */
    names: ArticleCategory['names'];
    /**
     * 父级类目
     */
    parentId: ArticleCategory['parentId'];
    /**
     * 指向链接
     */
    link?: ArticleCategory['link'];
    /**
     * 子类目
     */
    childs?: ResponseList[];
  }
}
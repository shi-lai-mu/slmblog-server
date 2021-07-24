import { Article } from '../../../entity/article.entity'

import { ArticleComment } from '../entity/comment.entity'
import { UserEntity } from 'src/modules/user/entity/user.entity'

import { ListPage } from 'src/interface/global.interface'

/**
 * 文章业务 评论 接口
 */
export namespace ArticleCommentNS {
  /**
   * 创建文章评论
   */
  export interface CreateArticleComment {
    /**
     * 踩赞文章
     */
    article: Article['id']
    /**
     * 评论内容
     */
    content: string
    /**
     * 评论用户ID
     */
    user?: UserEntity['id']
    /**
     * 父级评论ID
     */
    parent?: ArticleComment['id']
    /**
     * 昵称
     */
    nickname?: string
    /**
     * 网站/博客
     */
    link?: string
    /**
     * 邮箱
     */
    email?: string
  }

  /**
   * 评论列表
   */
  export interface CommentListItem extends ArticleComment {
    /**
     * 子评论
     */
    subComment: ListPage<ArticleComment>
  }
}

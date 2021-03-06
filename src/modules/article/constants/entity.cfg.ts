import { BaseInitEntity } from "src/entity/baseInitEntity";

const { tablePerfix } = BaseInitEntity.dbConfig;
/**
 * 文章实体表名
 */
export const ArticleTableName = {
  ARTICLE:      tablePerfix + 'article',
  LIKE:         tablePerfix + 'article_like',
  STAT:         tablePerfix + 'article_stat',
  CATEGORY:     tablePerfix + 'article_category',
  COMMENT:      tablePerfix + 'article_comment',
  COMMENT_LOVE: tablePerfix + 'article_comment_love',
};

/**
 * 文章状态
 */
export enum ArticleStateEnum {
  examine   = 0,  // 审核中
  routine   = 1,  // 常规
  topping   = 2,  // 置顶文章
  boutique  = 3,  // 精品文章
  recommend = 4,  // 推荐文章
  latest    = 5,  // 最新文章
  owner     = 6,  // 我的文章
  failed    = 7,  // 审核未通过
  isDelete  = 8,  // 已删除
}

/**
 * 点赞状态
 */
export enum ArticleLikeStatus {
  NotLike  = 0, // 未点赞
  Approved = 1, // 已点赞
}

/**
 * 文章审核状态
 */
export enum ArticleAuditEnum {
  NotReviewed = 0,  // 正在审核
  Approved    = 1,  // 审核通过
  Failed      = -1, // 审核未通过
}

/**
 * 文章评论是否已被置顶
 */
export enum ArticleCommentIsTop {
  true  = 0,
  false = 1,
}

/**
 * 文章评论是否已被删除
 */
export enum ArticleCommentIsDelete {
  true  = 0,
  false = 1,
}

/**
 * 评论 踩赞状态
 */
export enum ArticleLoveStatus {
  Praise = 1,    // 点赞
  Criticism = 2, // 点踩
}

/**
 * 评论 踩赞状态
 */
export enum ArticleLoveTarget {
  Article = 1, // 文章
  Comment = 2, // 评论
}
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
 * 文章异常状态定义
 */
export const AbnormalState = [
  ArticleStateEnum.isDelete, // 已删除
  ArticleStateEnum.failed,   // 审核未通过
  ArticleStateEnum.examine,  // 审核中
].map(v => String(v));

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
 * 定位评论ID类型枚举
 */
export enum CommentFindIdType {
  Article = 'atricle', // 文章
  comment = 'comment', // 评论
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
  false = 0, // 未删除
  true  = 1, // 已删除
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
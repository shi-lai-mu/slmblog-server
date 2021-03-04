import { BaseInitEntity } from "src/entity/baseInitEntity";


const { tablePerfix } = BaseInitEntity.dbConfig;
/**
 * 文章实体表名
 */
export const ArticleTableName = {
  ARTICLE:  tablePerfix + 'article',
  LIKE:     tablePerfix + 'article_like',
  STAT:     tablePerfix + 'article_stat',
  CATEGORY: tablePerfix + 'article_cas',
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
 * 用户权限
 */
export enum UserRole {
  Normal     = 1, // 普通用户
  BlogUser   = 2, // 博主用户
  Editor     = 3, // 网站编辑
  Admin      = 4, // 管理员
  SuperAdmin = 5, // 超级管理员
}

/**
 * 账号状态
 */
export enum UserStatus {
  InActive = 1, // 未激活
  Actived  = 2, // 已激活
  Frozen   = 3, // 已冻结
}


/**
 * 性别
 */
export enum UserGender {
  Male    = 0, // 男
  Female  = 1, // 女
  Unknown = 2, // 未知
}


/**
 * 校验策略类型
 */
export enum ValidateType {
 jwt   = 'jwt',   // token
 local = 'local', // account
}
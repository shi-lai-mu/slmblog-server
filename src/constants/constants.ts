/**
 * 默认API版本
 */
export const APIPrefix: string = '/api/v1/';

/**
 * 用户 逻辑常量
 */
export class USER_CONSTANTS {
  // 徽章
  static readonly BADGE_ICON_MAX_LENGTH: number = 20;  // 徽章图标 最大长度
  static readonly BADGE_NAME_MAX_LENGTH: number = 50;  // 徽章名称 最大长度
  static readonly BADEG_DESC_MAX_LENGTH: number = 100; // 徽章简介 最大长度
}

/**
 * 文章业务 逻辑常量
 */
export class ARTICLE_CONSTANTS {
  static readonly TITLE_MIN_LENGTH:    number = 5;   // 标题 最小长度
  static readonly TITLE_MAX_LENGTH:    number = 50;  // 标题 最大长度
  static readonly CONTENT_MIN_LENGTH:  number = 50;  // 文章 最小长度
  static readonly DESC_MIN_LENGTH:     number = 10;  // 简介 最小长度
  static readonly DESC_MAX_LENGTH:     number = 500; // 简介 最大长度
  static readonly CATEGORY_MIN_LENGTH: number = 1;   // 类目 最小长度
  static readonly CATEGORY_MAX_LENGTH: number = 200; // 类目 最大长度
}
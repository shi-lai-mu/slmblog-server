/**
 * 默认API版本
 */
export const APIPrefix: string = '/api/v1/';

/**
 * 用户 逻辑常量
 */
export class USER_CONSTANTS {
  static readonly ACCOUNT_MIN_LENGTH:   number = 6;    // 账号 最小长度
  static readonly ACCOUNT_MAX_LENGTH:   number = 16;   // 账号 最大长度
  static readonly PASSWORD_MIN_LENGTH:  number = 6;    // 密码 最小长度
  static readonly PASSWORD_MAX_LENGTH:  number = 20;   // 密码 最大长度
  static readonly NICKNAME_MIN_LENGTH:  number = 6;    // 昵称 最小长度
  static readonly NICKNAME_MAX_LENGTH:  number = 20;   // 昵称 最大长度
  static readonly DESC_MAX_LENGTH:      number = 250;  // 简介 最大长度
  static readonly AVATARURL_MAX_LENGTH: number = 300;  // 头像链接 最大长度
  static readonly LINKJSON_MAX_LENGTH:  number = 500;  // 个人链接 最大长度

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
  static readonly TITLE_MAX_LENGTH:    number = 5;   // 标题 最大长度
  static readonly CONTENT_MIN_LENGTH:  number = 50;  // 文章 最小长度
  static readonly DESC_MIN_LENGTH:     number = 10;  // 简介 最小长度
  static readonly DESC_MAX_LENGTH:     number = 500; // 简介 最大长度
  static readonly CATEGORY_MIN_LENGTH: number = 1;   // 类目 最小长度
  static readonly CATEGORY_MAX_LENGTH: number = 200; // 类目 最大长度
}
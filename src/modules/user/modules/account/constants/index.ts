/**
 * 用户业务 账号 常量
 */
export class USER_ACCOUNT_CONSTANTS {
  /** 账号 最小长度 */
  static readonly ACCOUNT_MIN_LENGTH: number = 6
  /** 账号 最大长度 */
  static readonly ACCOUNT_MAX_LENGTH: number = 16
  /** 密码 最小长度 */
  static readonly PASSWORD_MIN_LENGTH: number = 6
  /** 密码 最大长度 */
  static readonly PASSWORD_MAX_LENGTH: number = 20
  /** 验证码 长度 */
  static readonly CODE_LENGTH: number = 6
  /** 昵称 最小长度 */
  static readonly NICKNAME_MIN_LENGTH: number = 6
  /** 昵称 最大长度 */
  static readonly NICKNAME_MAX_LENGTH: number = 20
  /** 简介 最大长度 */
  static readonly DESC_MAX_LENGTH: number = 250
  /** 头像链接 最大长度 */
  static readonly AVATARURL_MAX_LENGTH: number = 300
  /** 个人链接 最大长度 */
  static readonly LINKJSON_MAX_LENGTH: number = 500
}

/**
 * 通知业务 邮件 常量
 */
export class NOTIFY_EMAIL {
  /** 发送邮件 限制时间 秒 */
  static readonly SEND_COOLING_S: number = 60 * 60 * 24
  /** 发送邮件 限制时间内的总数 最多可发送几次 */
  static readonly SEND_COOLING_COUNT: number = 3
  /** 发送邮件 间隔冷却时间 毫秒 */
  static readonly SEND_COOLING_TIME: number = 60 * 1000
}

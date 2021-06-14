import { Injectable, Logger } from '@nestjs/common'
import { SentMessageInfo } from 'nodemailer'
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer'

import { RedisService } from 'src/modules/coreModules/redis/redis.service'
import ConfigsService from 'src/modules/coreModules/config/configs.service'

import { NOTIFY_EMAIL } from '../constants'
import { formatJetlag } from 'src/utils/collection'
import { ResponseBody, Status } from 'src/constants/response'
import { NotifyEmailResponse } from '../constants/email.response'

/**
 * 通知业务 邮箱 逻辑层
 */
@Injectable()
export class NotifyEmailService {
  constructor(
    /** 核心 配置业务 逻辑层 */
    private readonly ConfigService: ConfigsService,
    /** 逻辑库 邮件 */
    private readonly MailerService: MailerService,
    /** 核心 Redis业务 逻辑层 */
    private readonly RedisService: RedisService,
    /** 基础库 日志 */
    private readonly Logger: Logger
  ) {}

  /**
   * 发送邮件
   * @param options 发送配置信息
   */
  async send(options: ISendMailOptions): Promise<SentMessageInfo | Status> {
    if (!options.to) {
      ResponseBody.throw(NotifyEmailResponse.EMAIL_SEND_TO_IS_EMPTY)
    }
    // 数据默认值定义
    const { web } = this.ConfigService
    options = {
      from: web.email.from,
      ...options,
    }
    return new Promise(async (res: SentMessageInfo, rej: (value: Status) => void) => {
      try {
        const send: SentMessageInfo = await this.MailerService.sendMail(options)
        send.status = send.response === '250 Ok: queued as '
        res(send)
      } catch (err) {
        rej(NotifyEmailResponse.EMAIL_SEND_ERROR)
        // TODO: 记录错误 code...
        this.Logger.debug(err, JSON.stringify(options))
      }
    })
  }

  /**
   * 是否允许发送
   * @description 如果发送数量已达上限或者短时间内频繁发送，则会直接报错形式跳出，否则会继续执行
   * @param email    邮件地址
   * @param sendLogs 已发送数量
   * @param sendMax  最大发送数量
   */
  async sendPermission(
    email: string,
    sendLogs?: string[],
    sendMax = NOTIFY_EMAIL.SEND_COOLING_COUNT
  ) {
    if (!sendLogs) {
      sendLogs = await this.getLogs(email)
    }
    // 未达到 总次数上限
    if (sendLogs.length + 1 <= sendMax) {
      // 连续发送冷却
      if (sendLogs.length) {
        const popLog = await this.getLog<ISendMailOptions>(`${email}${sendLogs.length - 1}`)
        if (popLog && popLog.context.time >= Date.now()) {
          const cooling = popLog.context.time - Date.now()
          const result = {
            cooling,
            text: `请${formatJetlag(Math.ceil(cooling / 1000), '秒')}后再试!`,
          }
          ResponseBody.throw({
            ...NotifyEmailResponse.EMAIL_SEND_OFTEN_MAX,
            result,
          })
        }
      }
    }
  }

  /**
   * 记录发送邮件日志
   * @param key  键
   * @param data 值
   */
  async logger(key: string, data: string, expiryMode?: string | any[], time?: string | number) {
    return this.RedisService.setItem('notify', `email:${key}`, data, expiryMode, time)
  }

  /**
   * 模糊获取记录发送邮件日志
   * @param key  键
   */
  async getLogs(key: string) {
    return this.RedisService.keys(`:email:${key}*`, 'notify')
  }

  /**
   * 获取记录发送邮件日志
   * @param key  键
   */
  async getLog<T>(key: string): Promise<T | null> {
    return this.RedisService.getItem('notify', `email:${key}`)
  }
}

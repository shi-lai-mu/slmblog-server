import { Injectable } from "@nestjs/common";
import { SentMessageInfo } from 'nodemailer';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';

import ConfigsService from "src/modules/coreModules/config/configs.service";

import { formatJetlag } from "src/utils/collection";
import { ResponseBody, Status } from "src/constants/response";
import { NotifyEmailResponse } from "../constants/email.response";
import { RedisService } from "src/modules/coreModules/redis/redis.service";



/**
 * 通知业务 邮箱 逻辑层
 */
@Injectable()
export class NotifyEmailService {

  constructor(
    private readonly MailerService: MailerService,
    private readonly RedisService: RedisService,
  ) {}


  /**
   * 发送邮件
   * @param options 发送配置信息
   */
  async send(options: ISendMailOptions): Promise<SentMessageInfo | Status> {
    return new Promise(async (res: SentMessageInfo, rej: (value: Status) => void) => {
      try {
        const send: SentMessageInfo = await this.MailerService.sendMail(options);
        send.status = send.response === '250 Ok: queued as ';
        res(send);
      } catch(err) {
        rej(NotifyEmailResponse.EMAIL_SEND_ERROR);
        // TODO: 记录错误 code...
      }
    });
  }



  /**
   * 是否允许发送
   * @description 如果发送数量已达上限或者短时间内频繁发送，则会直接报错形式跳出，否则会继续执行
   * @param email    邮件地址
   * @param sendLogs 已发送数量
   * @param sendMax  最大发送数量
   */
  async sendPernission(email: string, sendLogs: string[], sendMax: number) {
    // 未达到 总次数上限
    if (sendLogs.length + 1 <= sendMax) {
      // 连续发送冷却
      if (sendLogs.length) {
        const popLog = await this.getLog<ISendMailOptions>(`${email}${sendLogs.length - 1}`);
        if (popLog && popLog.context.time >= Date.now()) {
          const cooling = popLog.context.time - Date.now();
          ResponseBody.throw({
            ...NotifyEmailResponse.EMAIL_SEND_OFTEN_MAX,
            result: {
              cooling,
              text: `请${formatJetlag(Math.ceil(cooling / 1000), '秒')}后再试!`
            } as any,
          });
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
    return this.RedisService.setItem('notify', `email:${key}`, data, expiryMode, time);
  }


  /**
   * 模糊获取记录发送邮件日志
   * @param key  键
   */
  async getLogs(key: string) {
    return this.RedisService.keys(`:email:${key}*`, 'notify');
  }


  /**
   * 获取记录发送邮件日志
   * @param key  键
   */
  async getLog<T>(key: string): Promise<T | null> {
    return this.RedisService.getItem('notify', `email:${key}`);
  }
}
import { Injectable } from "@nestjs/common";
import { SentMessageInfo } from 'nodemailer';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';

import ConfigsService from "src/modules/coreModules/config/configs.service";

import { ResponseBody, Status } from "src/constants/response";
import { NotifyResponse } from "../constants/response.cfg";
import { RedisService } from "src/modules/coreModules/redis/redis.service";



/**
 * 通知业务 邮箱 逻辑层
 */
@Injectable()
export class NotifyEmailService {

  constructor(
    private readonly MailerService: MailerService,
    private readonly configService: ConfigsService,
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
        rej(NotifyResponse.EMAIL_SEND_ERROR);
        // TODO: 记录错误 code...
      }
    });
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
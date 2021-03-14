import { Injectable } from "@nestjs/common";
import { MailerService } from '@nestjs-modules/mailer';


/**
 * 通知业务 邮箱 逻辑层
 */
@Injectable()
export class NotifyEmailService {

  constructor(
    private readonly mailerService: MailerService,
  ) {}

  /**
   * 发送注册账号验证码
   * @param email 邮箱号
   */
  async registerAccountCode(email: string) {
    this
      .mailerService
      .sendMail({
        to: '478889187@qq.com',
        subject: '测试发送',
        // text: '测试内容',
        template: 'email',
        from: {
          name: '史莱姆博客管理',
          address: 'service@slmblog.com',
        },
        context: {
          code: '123456',
        }
      })
      .then(res => console.log({res}))
      .catch(err => {
        throw err;
      })
  }
}
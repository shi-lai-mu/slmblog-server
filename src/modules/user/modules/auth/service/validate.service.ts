import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { SentMessageInfo } from 'nodemailer'
import { InjectRepository } from '@nestjs/typeorm'

import { UserEntity } from 'src/modules/user/entity/user.entity'

import { UserService } from '../../../user.service'
import { NotifyEmailService } from 'src/modules/notify/modules/email/service/email.service'

import { shieldContent } from 'src/utils/crypto'
import { ValidateEmailDto } from '../dto/auth.dto'
import { ResponseBody, Status } from 'src/constants/response'
import { formatJetlag, generateUUID } from 'src/utils/collection'
import { NOTIFY_EMAIL } from 'src/modules/notify/modules/email/constants'
import { NotifyEmailResponse } from 'src/modules/notify/modules/email/constants/email.response'

/**
 * 用户业务 认证 逻辑层
 */
@Injectable()
export class UserAuthValidateService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    private readonly UserService: UserService,
    private readonly NotifyEmailService: NotifyEmailService
  ) {}
  1
  /**
   * 发送 账号邮箱验证 邮件通知
   * @param query 账号&邮箱 入参
   * @returns
   */
  async sendValidateAccountEmail(query: ValidateEmailDto) {
    const { SEND_COOLING_COUNT, SEND_COOLING_S, SEND_COOLING_TIME } = NOTIFY_EMAIL
    const { NotifyEmailService } = this
    const { account } = query
    const { env } = process
    const isRegister = await this.UserService.isRegister(account)
    let { email } = query

    if (!isRegister) ResponseBody.throw(NotifyEmailResponse.EMAIL_SEND_CURRENT_NOT_REG)

    if (!email) {
      if (!isRegister.email) ResponseBody.throw(NotifyEmailResponse.EMAIL_SEND_ACCOUNT_NOT_INP)
      email = isRegister.email
    }

    const sendLogs = await NotifyEmailService.getLogs(email)
    const uuid = generateUUID()
    const content = {
      to: email,
      subject: '请验证您的邮箱',
      template: './email',
      from: env.EMAIL_SEND_FROM_ADDRESS,
      context: {
        email,
        systemAccount: account,
        uuid,
        account: shieldContent(account, 2, 2),
        host: env.EMAIL_TRANSPORT_HOST,
        supportEmail: env.EMAIL_SEND_FROM_ADDRESS,
        validateUrl: `${env.LISTEN_HOSTNAME}/user/validate/email?uuid=${uuid}&code=${email}&n=${sendLogs.length}`,
        fromAddress: env.EMAIL_SEND_FROM_ADDRESS,
        validateTimeString: formatJetlag(SEND_COOLING_S * 1000, '小时'),
        copyRight: `© 2018-${new Date().getFullYear()}, SlmBlog, ${env.LISTEN_HOSTNAME}.`,
        time: Date.now() + SEND_COOLING_TIME,
      },
    }

    await NotifyEmailService.sendPermission(email, sendLogs, SEND_COOLING_COUNT)
    const sendQuery: Status | SentMessageInfo = await NotifyEmailService.send(content)
    // 执行成功则记录状态
    if (sendQuery.status) {
      this.NotifyEmailService.logger(
        `${email}${sendLogs.length}`,
        JSON.stringify(content),
        'EX',
        SEND_COOLING_S
      )
      return sendQuery.status
    }

    return ResponseBody.throw(NotifyEmailResponse.EMAIL_SEND_ERROR)
  }
}

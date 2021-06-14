import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ISendMailOptions } from '@nestjs-modules/mailer'
import { Controller, Post, Query, Put, Body } from '@nestjs/common'

import { UserAuthService } from '../service/auth.service'
import ConfigsService from 'src/modules/coreModules/config/configs.service'
import { NotifyEmailService } from 'src/modules/notify/modules/email/service/email.service'

import { ValidateAccountEmailDto } from '../dto/auth.dto'
import { ResponseBody } from 'src/constants/response'
import { ValidateEmailDto } from '../dto/auth.dto'
import { formatJetlag } from 'src/utils/collection'
import { MainCPrefix } from 'src/modules/user/constants/controller.cfg'
import { NOTIFY_EMAIL } from 'src/modules/notify/modules/email/constants'
import { NotifyEmailResponse } from 'src/modules/notify/modules/email/constants/email.response'
import { UserAuthValidateService } from '../service/validate.service'

export const controllerPerfix = MainCPrefix + '/validate'
/**
 * 用户业务 控制层
 */
@Controller(controllerPerfix)
@ApiTags('用户')
export class UserAuthValidateController {
  constructor(
    private readonly ConfigService: ConfigsService,
    private readonly UserAuthService: UserAuthService,
    private readonly NotifyEmailService: NotifyEmailService,
    private readonly UserAuthValidateService: UserAuthValidateService
  ) {}

  /**
   * 发送 账号邮箱验证 邮件通知
   */
  @Post('/email')
  @ApiOperation({
    summary: '发送 账号邮箱验证 邮件通知',
    description: `会向指定邮箱发送 验证账号邮箱邮件，有效时间为\`${formatJetlag(
      NOTIFY_EMAIL.SEND_COOLING_S * 1000,
      '小时'
    )}\`<br>
      **防止轰炸：**邮箱一分钟内只能发送\`1次\`，一个邮箱一天最多发送\`${
        NOTIFY_EMAIL.SEND_COOLING_COUNT
      }次\`<br>
      **注意：**本邮件的验证码只能用于\`验证账号邮箱\`，不适用其他验证
    `,
  })
  async sendValidateAccountEmail(@Query() query: ValidateEmailDto) {
    return this.UserAuthValidateService.sendValidateAccountEmail(query)
  }

  /**
   * 发送 找回密码 邮件通知
   */
  @Post('/email')
  @ApiOperation({
    summary: '发送 账号邮箱验证 邮件通知',
    description: `会向指定邮箱发送 验证账号邮箱邮件，有效时间为\`${formatJetlag(
      NOTIFY_EMAIL.SEND_COOLING_S * 1000,
      '小时'
    )}\`<br>
       **防止轰炸：**邮箱一分钟内只能发送\`1次\`，一个邮箱一天最多发送\`${
         NOTIFY_EMAIL.SEND_COOLING_COUNT
       }次\`<br>
       **注意：**本邮件的验证码只能用于\`验证账号邮箱\`，不适用其他验证
     `,
  })
  async sendResetAccountPasswordEmail(@Query() query: ValidateEmailDto) {
    //  const { SEND_COOLING_COUNT, SEND_COOLING_S, SEND_COOLING_TIME } = NOTIFY_EMAIL;
    //  const { web } = this.ConfigService;
    //  const { NotifyEmailService } = this;
    //  const { email, account } = query;
    //  const isRegister = await this.UserAccountService.isRegister(account);
    //  if (!isRegister) ResponseBody.throw(NotifyEmailResponse.EMAIL_SEND_CURRENT_NOT_REG);
    //  const sendLogs = await NotifyEmailService.getLogs(email);
    //  const uuid = generateUUID();
    //  const content = {
    //    to: query.email,
    //    subject: '请验证您的邮箱',
    //    template: 'email',
    //    from: web.email.from,
    //    context: {
    //      email,
    //      systemAccount: account,
    //      uuid,
    //      account: shieldContent(account, 2, 2),
    //      host: web.host,
    //      supportEmail: web.email.support,
    //      validateUrl: `${web.host}/user/validate/email?uuid=${uuid}&code=${email}&n=${sendLogs.length}`,
    //      fromAddress: web.email.from.address,
    //      validateTimeString: formatJetlag(SEND_COOLING_S * 1000, '小时'),
    //      copyRight: `© 2018-${new Date().getFullYear()}, SlmBlog, ${web.host}.`,
    //      time: Date.now() + SEND_COOLING_TIME,
    //    },
    //  };
    //  await NotifyEmailService.sendPermission(email, sendLogs, SEND_COOLING_COUNT);
    //  const sendQuery: Status | SentMessageInfo = await NotifyEmailService.send(content);
    //  // 执行成功则记录状态
    //  if (sendQuery.status) {
    //    this.NotifyEmailService.logger(`${email}${sendLogs.length}`, JSON.stringify(content), 'EX', SEND_COOLING_S);
    //    return sendQuery.status;
    //  }
    //  return ResponseBody.throw(NotifyEmailResponse.EMAIL_SEND_ERROR);
  }

  /**
   * 验证 账号邮箱
   */
  @Put('/email')
  @ApiOperation({
    summary: '验证 账号邮箱',
    description: '验证 [`发送 账号邮箱验证 邮件通知`] 接口的绑定状态，绑定成功后账号将被`激活`',
  })
  async validateAccountEmail(@Body() validateBody: ValidateAccountEmailDto) {
    const { email, id, uuid } = validateBody

    // 验证序列号 和 序列ID
    const log = await this.NotifyEmailService.getLog<ISendMailOptions | null>(`${email}${id}`)
    if (!log || log?.context?.uuid !== uuid) {
      ResponseBody.throw(NotifyEmailResponse.EMAIL_VALIDATE_UUID_ERROR)
    }

    return (await this.UserAuthService.updateAuthEmail(log.context.systemAccount, email))
      ? `账号已激活且绑定${email}邮箱!`
      : NotifyEmailResponse.ACCOUNT_EMAIL_UPDATE_ERROR
  }
}

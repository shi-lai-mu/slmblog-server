import { SentMessageInfo } from 'nodemailer';
import { Controller, Get, Post, Req, Query, Put, Body } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

import { UserAuthService } from "../service/auth.service";
import ConfigsService from "src/modules/coreModules/config/configs.service";
import { NotifyEmailService } from "src/modules/notify/service/email.service";

import { shieldContent } from "src/utils/crypto";
import { ValidateEmailDto } from "../dto/user.dto";
import { ResponseBody, ResponseEnum, Status } from "src/constants/response";
import { GlobalRequest } from "src/interface/gloabl.interface";
import { formatJetlag, generateUUID } from 'src/utils/collection';
import { MainCPrefix } from "src/modules/user/constants/controller.cfg";
import { NOTIFY_EMAIL } from 'src/modules/notify/constants/controller.cfg';
import { NotifyResponse } from 'src/modules/notify/constants/response.cfg';
import { ValidateAccountEmailDto } from '../dto/auth.dto';
import { ISendMailOptions } from '_@nestjs-modules_mailer@1.5.1@@nestjs-modules/mailer';



const controllerPerfix = MainCPrefix + '/auth';
/**
 * 用户业务 认证 控制层
 */
@Controller(controllerPerfix)
@ApiTags('用户 (认证)')
export class UserAuthController {

  constructor(
    private readonly ConfigService: ConfigsService,
    private readonly UserAuthService: UserAuthService,
    private readonly NotifyEmailService: NotifyEmailService,
  ) {}


  /**
   * 刷新令牌
   */
  @Get('refresh/token')
  @ApiOperation({
    summary: '刷新令牌',
    description: '置换旧令牌',
  })
  @ApiBearerAuth()
  async refreshJWT(@Req() req?: GlobalRequest) {
    return this.UserAuthService.refreshJWT(req.headers['authorization']);
  }


  /**
   * 发送 账号邮箱验证 邮件通知
   */
  @Post('/validate/email')
  @ApiOperation({
    summary: '发送 账号邮箱验证 邮件通知',
    description: `会向指定邮箱发送 验证账号邮箱邮件，有效时间为\`${formatJetlag(NOTIFY_EMAIL.SEND_COOLING_S * 1000, '小时')}\`<br>
      **防止轰炸：**邮箱一分钟内只能发送\`1次\`，一个邮箱一天最多发送\`${NOTIFY_EMAIL.SEND_COOLING_COUNT}次\`<br>
      **注意：**本邮件的验证码只能用于\`验证账号邮箱\`，不适用其他验证
    `,
  })
  async sendValidateAccountEmail(@Query() query: ValidateEmailDto) {
    const { SEND_COOLING_COUNT, SEND_COOLING_S, SEND_COOLING_TIME } = NOTIFY_EMAIL;
    const { web } = this.ConfigService;
    const { NotifyEmailService } = this;
    const { email } = query;
    const sendLogs = await NotifyEmailService.getLogs(email);
    const uuid = generateUUID();
    const content = {
      to: query.email,
      subject: '请验证您的邮箱',
      template: 'email',
      from: web.email.from,
      context: {
        email,
        systemAccount: query.account,
        uuid,
        account: shieldContent(query.account, 2, 2),
        host: web.host,
        supportEmail: web.email.support,
        validateUrl: `${web.host}/user/validate/email?uuid=${uuid}&code=${email}&n=${sendLogs.length}`,
        fromAddress: web.email.from.address,
        validateTimeString: formatJetlag(SEND_COOLING_S * 1000, '小时'),
        copyRight: `© 2018-${ new Date().getFullYear() }, SlmBlog, ${web.host}.`,
        time: Date.now() + SEND_COOLING_TIME,
      },
    };

    // 未达到 总次数上限
    if (sendLogs.length + 1 <= SEND_COOLING_COUNT) {
      // 连续发送冷却
      if (sendLogs.length) {
        const popLog = await NotifyEmailService.getLog<typeof content>(`${email}${sendLogs.length - 1}`);
        if (popLog && popLog.context.time >= Date.now()) {
          const cooling = popLog.context.time - Date.now();
          ResponseBody.throw({
            ...NotifyResponse.EMAIL_SEND_OFTEN_MAX,
            result: {
              cooling,
              text: `请${formatJetlag(Math.ceil(cooling / 1000), '秒')}后再试!`
            } as any,
          });
        }
      }
      const sendQuery: Status | SentMessageInfo = await NotifyEmailService.send(content);
      // 执行成功则记录状态
      if (sendQuery.status) {
        this.NotifyEmailService.logger(`${email}${sendLogs.length}`, JSON.stringify(content), 'EX', SEND_COOLING_S);
      }
      return sendQuery.status;
    } else {
      ResponseBody.throw(NotifyResponse.EMAIL_SEND_MAX_COUNT);
    }

    return ResponseBody.throw(NotifyResponse.EMAIL_SEND_ERROR);
  }
 

  /**
   * 验证 账号邮箱
   */
  @Put('/validate/email')
  @ApiOperation({
    summary: '验证 账号邮箱',
    description: '验证 [`发送 账号邮箱验证 邮件通知`] 接口的绑定状态，绑定成功后账号将被`激活`',
  })
  async validateAccountEmail(@Body() validateBody: ValidateAccountEmailDto) {
    const { email, id, uuid } = validateBody;

    // 验证序列号 和 序列ID
    const log = await this.NotifyEmailService.getLog<ISendMailOptions | null>(`${email}${id}`);
    if (!log || log?.context?.uuid !== uuid) {
      ResponseBody.throw(NotifyResponse.EMAIL_VALIDATE_UUID_ERROR);
    }

    return await this.UserAuthService.updateAuthEmail(log.context.systemAccount, email)
      ? { ...ResponseEnum.SUCCESS, result: `账号已激活且绑定${email}邮箱!` }
      : NotifyResponse.ACCOUNT_EMAIL_UPDATE_ERROR
    ;
  }
  
}
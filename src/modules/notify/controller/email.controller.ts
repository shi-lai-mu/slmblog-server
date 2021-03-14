import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { NotifyEmailService } from "../service/email.service";

import { MainCPrefix } from "../constants/controller.cfg";
import { NotifyEmailRegisterAccountDto } from "../dto/email.dto";



/**
 * 通知业务 邮箱 控制层
 */
@Controller(MainCPrefix + '/email')
@ApiTags('通知')
export class NotifyEmailController {

  constructor(
    private readonly NotifyEmailService: NotifyEmailService,
  ) {}

  /**
   * 发送 账号注册验证码 邮件通知
   */
  @Get('/account/register')
  @ApiOperation({
    summary: '发送 账号注册验证码 邮件通知',
    description: `会向指定邮箱内发送注册账号时所需的验证码，有效时间为\`十分钟\`<br>
      **防止轰炸：**邮箱一分钟内只能发送\`1次\`，一个邮箱一天最多发送\`3次\`<br>
      **注意：**本邮件的验证码只能用于\`账号注册\`，不适用其他验证
    `,
  })
  async registerAccountCode(@Query() emailParams: NotifyEmailRegisterAccountDto) {
    return this.NotifyEmailService.registerAccountCode(emailParams.email);
  }

}
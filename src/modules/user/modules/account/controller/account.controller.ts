import { AuthGuard } from '@nestjs/passport'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Body, Controller, Post, Request, UseGuards, Get, Req, Query } from '@nestjs/common'

import { UserEntity } from 'src/modules/user/entity/user.entity'

import { UserService } from '../../../user.service'
import { UserServiceBase } from '../../../user.base'
import { UserAccountService } from '../service/account.service'

import { getClientIP } from 'src/utils/collection'
import { ResponseBody } from 'src/constants/response'
import { GlobalRequest } from 'src/interface/gloabl.interface'
import { CurUser } from 'src/core/decorators/global.decorators'
import { UserAccountResponse } from '../constants/account.response'
import { FrequentlyGuards } from 'src/core/guards/frequently.guards'
import { MainCPrefix } from 'src/modules/user/constants/controller.cfg'
import { UserLoginDto, UserAccountDto, UserRegisterDto } from '../dto/account.dto'

const controllerPerfix = MainCPrefix
/**
 * 用户业务 账号 控制层吧
 */
@Controller(controllerPerfix)
@ApiTags('用户')
export class UserAccountController {
  constructor(
    private readonly UserAccountService: UserAccountService,
    private readonly UserService?: UserService
  ) {}

  /**
   * 注册账号
   * @param loginBody 账号及密码
   */
  @Post('register')
  @UseGuards(FrequentlyGuards({ interval: 0.5 }))
  @ApiOperation({
    summary: '注册',
    description: `用户注册账号入口, 此接口的邮箱为必传<br>
    注意：在注册成功后默认会向\`目标邮箱内发送验证账号的邮件\`! 如果是测试不想自动发送可传入\`notSend\`值为\`false\``,
  })
  async register(@Body() body: UserRegisterDto, @Request() req?: GlobalRequest) {
    const { account } = body
    const nameFormat = /^[a-z0-9_\-@\.]+$/i.test(account)
    const nameFormatReg = [/^(\.+|\-+|_+|&+)$/].some(v => v.test(account))

    if (!nameFormat || nameFormatReg) {
      ResponseBody.throw(UserAccountResponse.ACCOUNT_FORMAT)
    }

    let userAgent = req.headers['user-agent']
    if (userAgent) {
      userAgent = UserServiceBase.getSystemPlatform(userAgent)
    }

    const user = await this.UserAccountService.create(body, {
      ip: getClientIP(req),
      systemPlatform: userAgent,
    })

    return user
  }

  /**
   * 登录账号
   * @param loginBody 账号及密码
   */
  @Post('signin')
  @UseGuards(AuthGuard('local'))
  @ApiOperation({
    summary: '登录',
    description: '账号可以是邮箱',
  })
  async login(
    @CurUser() user: UserEntity,
    @Body() _body: UserLoginDto,
    @Req() req?: GlobalRequest
  ) {
    this.UserAccountService.login(user, {
      ip: getClientIP(req),
      systemPlatform: req.headers['user-agent'],
    })
    return this.UserService.find({
      id: user.id,
      iv: user.iv,
    })
  }

  /**
   * 检测账号注册状态
   */
  @Get('/check/register')
  @ApiOperation({
    summary: '检测 账号/邮箱 是否可注册',
    description:
      '检测账号或者邮箱是否可注册，如果邮箱处于未认证状态也同样会被检测为占用!<br>code为0是可注册，否则为不可注册!',
  })
  async checkAccountRegister(@Query() query: UserAccountDto) {
    return !(await this.UserService.isRegister(query.account)) || UserAccountResponse.REG_AC_EXISTS
  }
}

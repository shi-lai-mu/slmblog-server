import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Controller, Get, Req } from '@nestjs/common'

import { UserAuthService } from '../service/auth.service'

import { GlobalRequest } from 'src/interface/global.interface'
import { MainCPrefix } from 'src/modules/user/constants/controller.cfg'

const controllerPerfix = MainCPrefix + '/auth'
/**
 * 用户业务 认证 控制层
 */
@Controller(controllerPerfix)
@ApiTags('用户 (认证)')
export class UserAuthController {
  constructor(private readonly UserAuthService: UserAuthService) {}

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
    return this.UserAuthService.refreshJWT(req.headers['authorization'])
  }
}

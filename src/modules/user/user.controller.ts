import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { UserEntity } from './entity/user.entity';

import { UserService } from './user.service';
import { UserConfigService } from './modules/config/service/config.service';

import { ResponseBody } from 'src/constants/response';
import { UserSpace } from 'src/interface/user.interface';
import { MainCPrefix } from './constants/controller.cfg';
import { JwtAuthGuard } from 'src/core/strategy/jwt.strategy';
import { CurUser } from 'src/core/decorators/global.decorators';
import { UserAccountResponse } from './modules/account/constants/account.response';



export const controllerPerfix = MainCPrefix;
/**
 * 用户业务 控制层
 */
@Controller(controllerPerfix)
@ApiTags('用户')
export class UserController {

  constructor(
    private readonly UserService: UserService,
    private readonly UserConfigService: UserConfigService,
  ) {}



  /**
   * 获取其他用户数据
   * @param id 用户ID
   */
  @Get(':id')
  @ApiOperation({
    summary: '获取其他用户数据',
  })
  @ApiParam({
    name: 'id',
    description: '用户ID',
  })
  async outherUser(@Param('id') id: UserEntity['id']) {
    const user = await this.UserService.outherUser(id);
    if (!user) {
      ResponseBody.throw(UserAccountResponse.FIND_USER_NULL);
    }
    return user;
  }


  /**
   * 获取个人信息
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '获取个人信息',
  })
  @ApiBearerAuth()
  async info(@CurUser() user: UserSpace.UserInfo) {
    delete user.password;
    delete user.iv;
    user.config = await this.UserConfigService.getConfig(user.id);
    return user;
  }
}

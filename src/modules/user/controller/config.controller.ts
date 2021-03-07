import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBasicAuth, ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CurUser } from "src/core/decorators/global.decorators";
import { User } from "src/modules/user/entity/user.entity";
import { JwtAuthGuard } from "src/core/strategy/jwt.strategy";

import { _USER_PATH_NAME_ } from "src/modules/user/controller/account.controller";
import { SaveUserConfigDto } from "../dto/config.dto";
import { UserConfigService } from "../service/config.service";

export const _USER_CFG_PATH_NAME_ = _USER_PATH_NAME_ + '/config';

/**
 * 用户业务 配置 控制层
 */
@Controller(_USER_CFG_PATH_NAME_)
@ApiTags('用户')
export class UserConfigController {

  constructor(
    private readonly UserConfigService: UserConfigService,
  ) {}


  /**
   * 保存用户配置
   * @param userConfig 配置内容
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '保存用户全部配置',
    description: '当前包括 站点配置、主题配置',
  })
  @ApiBearerAuth()
  async saveConfig(@CurUser() user: User, @Body() userConfig: SaveUserConfigDto) {
    return this.UserConfigService.saveConfig(user.id, userConfig);
  }



  /**
   * 获取用户配置
   */
  @Get('all')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '获取用户全部配置',
    description: '当前包括 站点配置、主题配置',
  })
  @ApiBearerAuth()
  async getConfig(@CurUser() user: User) {
    return await this.UserConfigService.getConfig(user.id) || {};
  }
}
import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBasicAuth, ApiTags } from "@nestjs/swagger";
import { CurUser } from "src/core/decorators/global.decorators";
import { User } from "src/modules/user/entity/user.entity";
import { JwtAuthGuard } from "src/modules/user/auth/jwt.strategy";

import { _USER_PATH_NAME_ } from "src/modules/user/userAccount.controller";
import { SaveUserConfigDto } from "../dto/userConfig.dto";
import { UserConfigService } from "./userConfig.service";

export const _USER_CFG_PATH_NAME_ = _USER_PATH_NAME_ + '/config';

/**
 * 用户配置 控制层
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
  @ApiBasicAuth()
  async saveConfig(@CurUser() user: User, @Body() userConfig: SaveUserConfigDto) {
    return this.UserConfigService.saveConfig(user.id, userConfig);
  }



  /**
   * 获取用户配置
   */
  @Get('all')
  @UseGuards(JwtAuthGuard)
  @ApiBasicAuth()
  async getConfig(@CurUser() user: User) {
    return this.UserConfigService.getConfig(user.id);
  }
}
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";

import { UserEntity } from "src/modules/user/entity/user.entity";

import { UserConfigService } from "../service/config.service";

import { SaveUserConfigDto } from "../dto/config.dto";
import { JwtAuthGuard } from "src/core/strategy/jwt.strategy";
import { CurUser } from "src/core/decorators/global.decorators";
import { MainCPrefix } from "../../constants/controller.cfg";



export const controllerPerfix = MainCPrefix + '/config';

/**
 * 用户业务 配置 控制层
 */
@Controller(controllerPerfix)
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
  async saveConfig(@CurUser() user: UserEntity, @Body() userConfig: SaveUserConfigDto) {
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
  async getConfig(@CurUser() user: UserEntity) {
    return await this.UserConfigService.getConfig(user.id) || {};
  }
}
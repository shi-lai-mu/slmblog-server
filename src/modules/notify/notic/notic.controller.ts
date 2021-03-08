import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Controller, Get } from "@nestjs/common";

import { NoticService } from "./notic.service";

import { APIPrefix } from "src/constants/constants";



/**
 * 常规公告 控制层
 */
@Controller({
  path: APIPrefix + 'notic'
})
@ApiTags('通知')
export class NoticController {

  constructor(
    private readonly NoticService: NoticService,
  ) {}


  /**
   * 获取置顶的常规公告
   */
  @Get()
  @ApiOperation({
    summary: '获取置顶的常规公告',
    description: '在首页的公告'
  })
  async getTopNotic() {
    return this.NoticService.getTopNotic();
  }
}
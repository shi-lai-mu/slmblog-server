import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { AppService } from './app.service'

import { Response } from './interface/global.interface'

/**
 * APP 控制层
 */
@Controller()
@ApiTags('API')
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * 测试连接状态
   */
  @Get()
  @ApiOperation({
    summary: '测试请求状态',
    description: '定义基础模型，测试访问是否成功!',
  })
  @ApiResponse({
    type: Response,
  })
  @ApiResponse({
    status: 200,
    description: '请求测试成功! 响应正常...',
  })
  getHello(): string {
    return this.appService.getHello()
  }
}

import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';



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
    summary: '测试状态',
  })
  getHello(): string {
    return this.appService.getHello();
  }
}

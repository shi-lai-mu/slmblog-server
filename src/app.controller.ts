import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { JwtAuthGuard } from './core/strategy/jwt.strategy';

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

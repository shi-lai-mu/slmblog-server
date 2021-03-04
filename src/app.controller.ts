import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { JwtAuthGuard } from './core/strategy/jwt.strategy';

@Controller()
@ApiTags('API')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: '测试状态',
  })
  getHello(): string {
    return this.appService.getHello();
  }
}

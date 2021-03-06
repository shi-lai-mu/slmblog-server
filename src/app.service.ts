import { Injectable } from '@nestjs/common';
import { RedisService } from './modules/coreModules/redis/redis.service';

@Injectable()
export class AppService {
  constructor(
    private readonly RedisService: RedisService,
  ) {
    this.RedisService.clearAll();
  }

  getHello(): string {
    return '访问检测成功!后端正常运行中...';
  }
}

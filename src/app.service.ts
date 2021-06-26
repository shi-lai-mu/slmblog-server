import { Injectable } from '@nestjs/common'

import { RedisService } from './modules/coreModules/redis/redis.service'

/**
 * APP 逻辑层
 */
@Injectable()
export class AppService {
  constructor(private readonly RedisService: RedisService) {
    // 清除缓存数据
    this.RedisService.clearAll()
  }

  /**
   * 测试访问
   */
  getHello(): string {
    return '访问检测成功!后端正常运行中...'
  }
}

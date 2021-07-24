import { Global, Module } from '@nestjs/common'
import { RedisConfig } from 'src/configs/type/db.cfg'

import { RedisService } from './redis.service'

/**
 * 核心 Redis 模块
 */
@Global()
@Module({
  providers: [RedisService, RedisConfig],
  exports: [RedisConfig],
})
export class RedisModule {}

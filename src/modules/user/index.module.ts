import { Module } from '@nestjs/common'

import { UserModule } from './user.module'
import { UserAuthModule } from './modules/auth/auth.module'
import { UserConfigModule } from './modules/config/config.module'
import { UserAccountModule } from './modules/account/account.module'
import { RedisModule } from '../coreModules/redis/redis.module'

/**
 * 用户业务 主模块
 */
@Module({
  imports: [UserModule, RedisModule, UserAuthModule, UserConfigModule, UserAccountModule],
})
export class UserBusinessModule {}

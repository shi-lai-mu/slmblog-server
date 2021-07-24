import { Logger, Module } from '@nestjs/common'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserEntity, UserConfigEntity } from '../../entity/user.entity'

import { UserAuthService } from '../auth/service/auth.service'
import { UserConfigService } from '../config/service/config.service'
import { UserAccountService } from './service/account.service'
import { UserAccountController } from './controller/account.controller'
import { RedisService } from 'src/modules/coreModules/redis/redis.service'
import { UserService } from '../../user.service'
import { UserAuthValidateService } from '../auth/service/validate.service'
import { NotifyEmailService } from 'src/modules/notify/modules/email/service/email.service'

/**
 * 用户业务 账号 模块
 */
@Module({
  imports: [
    // UserAuthModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.APP_JWT_SECRET,
        signOptions: {
          expiresIn: process.env.APP_JWT_OPT_EXPIRES_IN,
        },
      }),
    }),
    TypeOrmModule.forFeature([UserEntity, UserConfigEntity]),
  ],
  controllers: [UserAccountController],
  providers: [
    UserService,
    RedisService,
    UserAuthService,
    NotifyEmailService,
    UserAuthValidateService,
    UserConfigService,
    UserAccountService,
    Logger,
  ],
  exports: [UserAccountService, UserAuthService, Logger],
})
export class UserAccountModule {}

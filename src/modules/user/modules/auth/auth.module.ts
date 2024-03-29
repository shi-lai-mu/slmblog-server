import { JwtModule, JwtService } from '@nestjs/jwt'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PassportModule } from '@nestjs/passport'

import { UserConfigEntity, UserEntity } from '../../entity/user.entity'

import { UserService } from '../../user.service'
import { UserAuthService } from './service/auth.service'
import { UserAuthController } from './controller/auth.controller'
import { UserConfigService } from '../config/service/config.service'
import { UserAccountService } from '../account/service/account.service'
import { RedisService } from 'src/modules/coreModules/redis/redis.service'
import { NotifyEmailService } from 'src/modules/notify/modules/email/service/email.service'

import { JwtStrategy } from 'src/core/strategy/jwt.strategy'
import { LocalStrategy } from 'src/core/strategy/local.strategy'
import { UserAuthValidateModule } from './validate.module'
import { UserAuthValidateService } from './service/validate.service'

/**
 * 用户业务 认证 模块
 */
@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.APP_JWT_SECRET,
        signOptions: {
          expiresIn: process.env.APP_JWT_OPT_EXPIRES_IN,
        },
      }),
    }),
    TypeOrmModule.forFeature([UserEntity, UserConfigEntity]),
    UserAuthValidateModule,
  ],
  controllers: [UserAuthController],
  providers: [
    UserService,
    JwtStrategy,
    RedisService,
    LocalStrategy,
    UserAuthService,
    UserConfigService,
    UserAccountService,
    UserAuthValidateService,
    NotifyEmailService,
  ],
  exports: [UserAccountService, NotifyEmailService, UserAuthValidateService, JwtStrategy],
})
export class UserAuthModule {}

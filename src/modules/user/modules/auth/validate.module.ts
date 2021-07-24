import { Logger, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'

import { RedisService } from 'src/modules/coreModules/redis/redis.service'
import { NotifyEmailService } from 'src/modules/notify/modules/email/service/email.service'
import { UserEntity } from '../../entity/user.entity'
import { UserService } from '../../user.service'

import { UserAuthValidateController } from './controller/validate.controller'
import { UserAuthService } from './service/auth.service'
import { UserAuthValidateService } from './service/validate.service'

/**
 * 用户业务 权限验证 模块
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.APP_JWT_SECRET,
        signOptions: {
          expiresIn: process.env.APP_JWT_OPT_EXPIRES_IN,
        },
      }),
    }),
  ],
  controllers: [UserAuthValidateController],
  providers: [
    UserService,
    RedisService,
    UserAuthService,
    NotifyEmailService,
    UserAuthValidateService,
    Logger,
  ],
  exports: [UserAuthValidateService, NotifyEmailService, Logger],
})
export class UserAuthValidateModule {}

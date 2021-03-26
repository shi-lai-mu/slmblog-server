import { Logger, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";

import ConfigsService from "src/modules/coreModules/config/configs.service";
import { RedisService } from "src/modules/coreModules/redis/redis.service";
import { NotifyEmailService } from "src/modules/notify/modules/email/service/email.service";
import { UserEntity } from "../../entity/user.entity";
import { UserService } from "../../user.service";

import { UserAuthValidateController } from "./controller/validate.controller";
import { UserAuthService } from "./service/auth.service";
import { UserAuthValidateService } from "./service/validate.service";



/**
 * 用户业务 权限验证 模块
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
    ]),
    JwtModule.registerAsync({
      useFactory: (configsService: ConfigsService) => configsService.jwt,
      inject: [ ConfigsService ],
    }),
  ],
  controllers: [
    UserAuthValidateController,
  ],
  providers: [
    UserService,
    RedisService,
    UserAuthService,
    NotifyEmailService,
    UserAuthValidateService,
    Logger,
  ],
  exports: [
    UserAuthValidateService,
    NotifyEmailService,
    Logger,
  ]
})
export class UserAuthValidateModule {}
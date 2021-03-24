import { JwtModule } from "@nestjs/jwt";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from "@nestjs/passport";
import ConfigsService from "src/modules/coreModules/config/configs.service";

import { UserConfigEntity, UserEntity } from "../../entity/user.entity";

import { UserService } from "../../user.service";
import { UserAuthService } from "./service/auth.service";
import { UserAuthController } from "./controller/auth.controller";
import { UserConfigService } from "../config/service/config.service";
import { UserAccountService } from "../account/service/account.service";
import { RedisService } from "src/modules/coreModules/redis/redis.service";
import { NotifyEmailService } from "src/modules/notify/service/email.service";

import { JwtStrategy } from "src/core/strategy/jwt.strategy";
import { LocalStrategy } from "src/core/strategy/local.strategy";



/**
 * 用户业务 认证 模块
 */
@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configsService: ConfigsService) => configsService.jwt,
      inject: [ ConfigsService ],
    }),
    TypeOrmModule.forFeature([ UserEntity, UserConfigEntity]),
  ],
  controllers: [
    UserAuthController,
  ],
  providers: [
    UserService,
    JwtStrategy,
    RedisService,
    LocalStrategy,
    UserAuthService,
    UserConfigService,
    UserAccountService,
    NotifyEmailService,
  ],
})
export class UserAuthModule {};
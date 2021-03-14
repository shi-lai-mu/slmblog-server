import { JwtModule } from "@nestjs/jwt";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from "@nestjs/passport";
import ConfigsService from "src/modules/coreModules/config/configs.service";

import { UserConfigEntity, UserEntity } from "../entity/user.entity";

import { UserModule } from "./user.moudle";
import { UserAuthService } from "../service/auth.service";
import { UserAuthController } from "../controller/auth.controller";
import { RedisService } from "src/modules/coreModules/redis/redis.service";

import { JwtStrategy } from "src/core/strategy/jwt.strategy";
import { LocalStrategy } from "src/core/strategy/local.strategy";
import { NotifyEmailService } from "src/modules/notify/service/email.service";



/**
 * 用户业务 认证 模块
 */
@Module({
  imports: [
    UserModule,
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
    JwtStrategy,
    RedisService,
    LocalStrategy,
    UserAuthService,
    NotifyEmailService,
  ],
})
export class UserAuthModule {};
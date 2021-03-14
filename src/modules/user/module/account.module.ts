import { Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { TypeOrmModule } from "_@nestjs_typeorm@7.1.5@@nestjs/typeorm";

import { UserEntity, UserConfigEntity } from "../entity/user.entity";

import { UserService } from "../service/user.service";
import { UserAuthService } from "../service/auth.service";
import { UserConfigService } from "../service/config.service";
import { UserAccountService } from "../service/account.service";
import { UserAccountController } from "../controller/account.controller";
import { RedisService } from "src/modules/coreModules/redis/redis.service";
import ConfigsService from "src/modules/coreModules/config/configs.service";



/**
 * 用户业务 账号 模块
 */
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configsService: ConfigsService) => configsService.jwt,
      inject: [ ConfigsService ],
    }),
    TypeOrmModule.forFeature([
      UserEntity,
      UserConfigEntity,
    ]),
  ],
  controllers: [
    UserAccountController,
  ],
  providers: [
    UserService,
    RedisService,
    UserAuthService,
    UserConfigService,
    UserAccountService,
  ],
  exports: [
    RedisService,
  ]
})
export class UserAccountModule {};
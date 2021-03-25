import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserConfigEntity, UserEntity } from "./entity/user.entity";

import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { UserAccountService } from "./modules/account/service/account.service";
import { UserConfigService } from "./modules/config/service/config.service";
import { UserAccountModule } from "./modules/account/account.module";
import { RedisService } from "../coreModules/redis/redis.service";
import { RedisModule } from "../coreModules/redis/redis.module";



/**
 * 用户业务 用户 模块
 */
@Module({
  imports: [
    RedisModule,
    UserAccountModule,
    TypeOrmModule.forFeature([
      UserEntity,
      UserConfigEntity,
    ]),
  ],
  providers: [
    RedisService,
    UserService,
    UserConfigService,
  ],
})
export class UserModule {};
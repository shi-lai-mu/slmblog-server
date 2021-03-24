import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserConfigEntity, UserEntity } from "./entity/user.entity";

import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { UserAccountService } from "./modules/account/service/account.service";
import { UserConfigService } from "./modules/config/service/config.service";
import { UserAccountModule } from "./modules/account/account.module";



/**
 * 用户业务 用户 模块
 */
@Module({
  imports: [
    UserAccountModule,
    TypeOrmModule.forFeature([
      UserEntity,
      UserConfigEntity,
    ]),
  ],
  controllers: [
    UserController,
  ],
  providers: [
    UserService,
    UserConfigService,
    UserAccountService,
  ],
  exports: [
    UserService,
    UserConfigService,
    UserAccountService,
  ],
})
export class UserModule {};
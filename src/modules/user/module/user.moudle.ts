import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserConfigEntity, UserEntity } from "../entity/user.entity";

import { UserAccountModule } from "./account.module";
import { UserService } from "../service/user.service";
import { UserConfigService } from "../service/config.service";
import { UserController } from "../controller/user.controller";
import { UserAccountService } from "../service/account.service";



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
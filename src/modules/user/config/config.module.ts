import { Module } from "@nestjs/common";
import { TypeOrmModule } from "_@nestjs_typeorm@7.1.5@@nestjs/typeorm";

import { UserConfigController } from "./controller/config.controller";
import { UserConfigEntity } from "../entity/user.entity";
import { UserConfigService } from "./service/config.service";



/**
 * 用户业务 配置 模块
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserConfigEntity,
    ]),
  ],
  controllers: [
    UserConfigController,
  ],
  providers: [
    UserConfigService,
  ]
})
export class UserConfigModule {};
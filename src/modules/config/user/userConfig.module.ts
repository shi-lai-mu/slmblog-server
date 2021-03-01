import { Module } from "@nestjs/common";

import { UserConfigService } from "./userConfig.service";
import { UserConfigController } from "./userConfig.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserConfigEntity } from "src/modules/user/entity/user.entity";

/**
 * 用户配置 模块
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([UserConfigEntity]),
  ],
  controllers: [
    UserConfigController,
  ],
  providers: [
    UserConfigService,
  ]
})
export class UserConfigModule {}
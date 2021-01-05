import { Module } from "@nestjs/common";

import { SystemConfigService } from "./systemConfig.service";
import { SystemConfigController } from "./systemConfig.controller";

@Module({
  controllers: [
    SystemConfigController,
  ],
  providers: [
    SystemConfigService,
  ]
})
export class SystemConfigModule {}
import { Module } from "@nestjs/common";

import { SystemConfigModule } from "./system/systemConfig.module";

@Module({
  providers: [
    SystemConfigModule,
  ],
})
export class ConfigAllModule {}
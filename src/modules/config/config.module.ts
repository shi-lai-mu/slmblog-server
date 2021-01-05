import { Module } from "@nestjs/common";

import { SystemConfigModule } from "./system/systemConfig.module";
import { UserConfigModule } from "./user/userConfig.module";

@Module({
  imports: [
    SystemConfigModule,
    UserConfigModule,
  ],
})
export class ConfigAllModule {}
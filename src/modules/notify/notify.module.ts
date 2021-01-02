import { Module } from "@nestjs/common";

import { NoticModule } from './notic/notic.module';

/**
 * 通知业务 模块
 */
@Module({
  imports: [
    NoticModule,
  ],
})
export class NotifyModule {}
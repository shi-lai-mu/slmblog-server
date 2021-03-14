import { Module } from "@nestjs/common";

import { NoticModule } from './module/notic.module';
import { NotifyEmailModule } from "./module/email.module";



/**
 * 通知业务 模块
 */
@Module({
  imports: [
    NoticModule,
    NotifyEmailModule,
  ],
})
export class NotifyModule {};
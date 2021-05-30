import { Module } from "@nestjs/common";

import { NoticModule } from './modules/notic/notic.module';
import { NotifyEmailModule } from "./modules/email/email.module";
import { FriendModules } from "./modules/friend/friend.module";



/**
 * 通知业务 模块
 */
@Module({
  imports: [
    NoticModule,
    NotifyEmailModule,
    FriendModules,
  ],
})
export class NotifyBusinessModule {};
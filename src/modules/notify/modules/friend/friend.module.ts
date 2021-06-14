import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { FriendService } from './service/friend.service'
import { FriendController } from './controller/friend.controller'

import { FriendEntity } from './entity/friend.entity'
import { FriendReviewEntity } from './entity/friendReview.entity'
import { NotifyEmailService } from '../email/service/email.service'
import { NotifyEmailModule } from '../email/email.module'

/**
 * 通知模块 友情链接 业务模块
 */
@Module({
  imports: [TypeOrmModule.forFeature([FriendEntity, FriendReviewEntity]), NotifyEmailModule],
  controllers: [FriendController],
  providers: [FriendService, NotifyEmailService],
})
export class FriendModules {}

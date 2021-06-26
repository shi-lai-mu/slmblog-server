import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { NoticeEntity } from 'src/entity/notice.entity'

import { NoticService } from './service/notic.service'
import { NoticController } from './controller/notic.controller'

/**
 * 常规公告 模块
 */
@Module({
  imports: [TypeOrmModule.forFeature([NoticeEntity])],
  controllers: [NoticController],
  providers: [NoticService],
})
export class NoticModule {}

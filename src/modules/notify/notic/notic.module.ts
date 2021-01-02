import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { NoticService } from "./notic.service";
import { NoticController } from "./notic.controller";
import { NoticeEntity } from 'src/entity/notice.entity';

/**
 * 常规公告 模块
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([NoticeEntity]),
  ],
  controllers: [
    NoticController,
  ],
  providers: [
    NoticService,
  ]
})
export class NoticModule {}
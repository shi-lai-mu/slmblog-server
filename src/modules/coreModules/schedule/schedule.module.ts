import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ScheduleModule } from "@nestjs/schedule";

import { Article } from "src/modules/article/entity/article.entity";
import { ArticleComment } from "src/modules/article/entity/comment.entity";
import { ArticleLove } from "src/modules/article/entity/comment.love.entity";

import { RedisService } from "../redis/redis.service";
import { ScheduleSaveTaskService } from "./saveTask.service";
import { ArticleBehaviorService } from "src/modules/article/service/behavior.service";



/**
 * 核心 定时器 主模块
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Article,
      ArticleComment,
      ArticleLove,
    ]),
    ScheduleModule.forRoot(),
  ],
  providers: [
    Logger,
    ScheduleSaveTaskService,
    RedisService,
    ArticleBehaviorService,
  ],
})
export class ScheduleBusinessModule {}
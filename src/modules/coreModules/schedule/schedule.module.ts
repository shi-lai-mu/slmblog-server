import { Logger, Module } from "@nestjs/common";
import { ScheduleModule, SchedulerRegistry } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Article } from "src/modules/article/entity/article.entity";
import { ArticleComment } from "src/modules/article/entity/comment.entity";
import { ArticleLove } from "src/modules/article/entity/comment.love.entity";
import { ArticleModule } from "src/modules/article/module/article.module";
import { ArticleService } from "src/modules/article/service/article.service";
import { ArticleCommentService } from "src/modules/article/service/comment.service";
import { RedisModule } from "../redis/redis.module";
import { RedisService } from "../redis/redis.service";
import { ScheduleSaveTaskService } from "./saveTask.service";

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
    ArticleCommentService,
  ],
})
export class ScheduleBusinessModule {}
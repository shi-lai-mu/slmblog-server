import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Article } from "../../entity/article.entity";
import { ArticleComment } from "../comment/entity/comment.entity";
import { ArticleLove } from "../comment/entity/comment.love.entity";

import { ArticleBehaviorService } from "./service/behavior.service";
import { RedisService } from "src/modules/coreModules/redis/redis.service";
import { ArticleBehaviorController } from "./controller/behavior.controller";



/**
 * 文章业务 行为 模块
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Article,
      ArticleComment,
      ArticleLove,
    ]),
  ],
  controllers: [
    ArticleBehaviorController,
  ],
  providers: [
    RedisService,
    ArticleBehaviorService,
  ],
})
export class ArticleBehaviorModule {}
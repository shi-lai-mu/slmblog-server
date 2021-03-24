import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Article } from "../../entity/article.entity";
import { ArticleComment } from "./entity/comment.entity";
import { ArticleLove } from "./entity/comment.love.entity";

import { ArticleCommentService } from "./service/comment.service";
import { RedisService } from "src/modules/coreModules/redis/redis.service";
import { ArticleCommentController } from "./controller/comment.controller";



/**
 * 文章业务 评论 模块
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
    ArticleCommentController,
  ],
  providers: [
    RedisService,
    ArticleCommentService,
  ],
})
export class ArticleCommentModule {}
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ArticleComment } from "../entity/comment.entity";
import { ArticleLove } from "../entity/comment.love.entity";
import { Article } from "src/modules/article/entity/article.entity";
import { ArticleStat } from "src/modules/article/entity/stat.entity";

import { ArticleService } from "../service/article.service";
import { ArticleCommentService } from "../service/comment.service";
import { ArticleController } from "../controller/article.controller";
import { RedisService } from "src/modules/coreModules/redis/redis.service";



/**
 * 文章业务 模块
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Article,
      ArticleStat,
      ArticleLove,
      ArticleComment,
    ]),
  ],
  controllers: [
    ArticleController,
  ],
  providers: [
    RedisService,
    ArticleService,
    ArticleCommentService,
  ],
  exports: [],
})
export class ArticleModule {}
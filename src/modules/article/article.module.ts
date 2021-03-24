import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ArticleStat } from "./modules/comment/entity/stat.entity";
import { Article } from "src/modules/article/entity/article.entity";
import { ArticleComment } from "./modules/comment/entity/comment.entity";
import { ArticleLove } from "./modules/comment/entity/comment.love.entity";

import { ArticleService } from "./article.service";
import { ArticleController } from "./article.controller";
import { ArticleCommentService } from "./modules/comment/service/comment.service";
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
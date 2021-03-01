import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ArticleService } from "./article.service";
import { RedisService } from "../redis/redis.service";
import { ArticleController } from "./article.controller";
import { Article } from "src/entity/article/article.entity";
import { ArticleStat } from "src/entity/article/stat.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ Article, ArticleStat ])],
  controllers: [ArticleController],
  providers: [ArticleService, RedisService],
  exports: [ArticleService],
})
export class ArticleModule {}
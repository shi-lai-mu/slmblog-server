import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Article, ArticleStat } from "src/entity/article.entity";
import { RedisService } from "../redis/redis.service";
import { ArticleController } from "./article.controller";
import { ArticleService } from "./article.service";

@Module({
  imports: [TypeOrmModule.forFeature([ Article, ArticleStat ])],
  controllers: [ArticleController],
  providers: [ArticleService, RedisService],
  exports: [ArticleService],
})
export class ArticleModule {}
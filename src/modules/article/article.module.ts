import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ArticleService } from "./service/article.service";
import { RedisService } from "../redis/redis.service";
import { ArticleController } from "./controller/article.controller";
import { Article } from "src/modules/article/entity/article.entity";
import { ArticleStat } from "src/modules/article/entity/stat.entity";
import { ArticleCategoryContorller } from "./controller/category.controller";
import { ArticleCategoryService } from "./service/category.service";
import { ArticleCategory } from "./entity/categorys.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Article,
      ArticleStat,
      ArticleCategory,
    ]),
  ],
  controllers: [
    ArticleController,
    ArticleCategoryContorller,
  ],
  providers: [
    RedisService,
    ArticleService,
    ArticleCategoryService,
  ],
  exports: [],
})
export class ArticleModule {}
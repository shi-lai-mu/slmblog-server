import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ArticleService } from "../service/article.service";
import { ArticleController } from "../controller/article.controller";

import { Article } from "src/modules/article/entity/article.entity";
import { ArticleStat } from "src/modules/article/entity/stat.entity";

/**
 * 文章业务 模块
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Article,
      ArticleStat,
    ]),
  ],
  controllers: [
    ArticleController,
  ],
  providers: [
    ArticleService,
  ],
  exports: [],
})
export class ArticleModule {}
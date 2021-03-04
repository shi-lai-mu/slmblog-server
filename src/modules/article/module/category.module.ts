import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleCategoryContorller } from "../controller/category.controller";
import { ArticleCategory } from "../entity/categorys.entity";
import { ArticleCategoryService } from "../service/category.service";

/**
 * 文章业务 类目 模块
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      ArticleCategory,
    ]),
  ],
  controllers: [
    ArticleCategoryContorller,
  ],
  providers: [
    ArticleCategoryService,
  ],
})
export class ArticleCategoryModule {};
import { Module } from "@nestjs/common";

import { ArticleModule } from "./article.module";
import { ArticleCommentModule } from "./modules/comment/comment.module";
import { ArticleBehaviorModule } from "./modules/behavior/behavior.module";
import { ArticleCategoryModule } from "./modules/category/category.module";



/**
 * 文章业务主模块
 */
@Module({
  imports: [
    ArticleModule,
    ArticleCategoryModule,
    ArticleCommentModule,
    ArticleBehaviorModule,
  ],
})
export class ArticleBusinessModule {}
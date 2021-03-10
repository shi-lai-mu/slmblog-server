import { Module } from "@nestjs/common";

import { ArticleModule } from "./module/article.module";
import { ArticleCommentModule } from "./module/comment.module";
import { ArticleBehaviorModule } from "./module/behavior.module";
import { ArticleCategoryModule } from "./module/category.module";



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
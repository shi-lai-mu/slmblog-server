import { Module } from "@nestjs/common";
import { ArticleModule } from "./module/article.module";
import { ArticleCategoryModule } from "./module/category.module";
import { ArticleCommentModule } from "./module/comment.module";

/**
 * 文章业务主模块
 */
@Module({
  imports: [
    ArticleModule,
    ArticleCategoryModule,
    ArticleCommentModule,
  ],
})
export class ArticleBusinessModule {}
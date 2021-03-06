import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RedisService } from "src/modules/redis/redis.service";
import { ArticleCommentController } from "../controller/comment.controller";
import { Article } from "../entity/article.entity";
import { ArticleComment } from "../entity/comment.entity";
import { ArticleLove } from "../entity/comment.love.entity";
import { ArticleCommentService } from "../service/comment.service";

/**
 * 文章业务 评论 模块
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Article,
      ArticleComment,
      ArticleLove,
    ]),
  ],
  controllers: [
    ArticleCommentController,
  ],
  providers: [
    RedisService,
    ArticleCommentService,
  ]
})
export class ArticleCommentModule {}
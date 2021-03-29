import { Length } from "class-validator";
import { ValidateThrow } from "src/constants/response";
import { ApiProperty } from "_@nestjs_swagger@4.7.15@@nestjs/swagger";

import { ArticleComment } from "../entity/comment.entity";

import { ArticleResponse } from "../../../constants/response.cfg";
import { ARTICLE_COMMENT } from "../../../constants/controller.cfg";

/**
 * 发表文章评论入参
 */
export class SendArticleCommentDto {
  /**
   * 评论内容
   */
  @Length(
    ARTICLE_COMMENT.SEND_COMMENT_CONTENT_MIN,
    ARTICLE_COMMENT.SEND_COMMENT_CONTENT_MAX,
    ValidateThrow(ArticleResponse.SEND_COMMENT_CONTENT_LENGTH),
  )
  @ApiProperty({
    description: '评论内容',
    default: '这是一条评论内容...',
  })
  content: string;

  /**
   * 昵称
   */
  @ApiProperty({
    description: '昵称',
    required: false,
  })
  nickname?: string;

  /**
   * 邮箱
   */
  @ApiProperty({
    description: '邮箱',
    required: false,
  })
  email?: string;

  /**
   * 文章/微博
   */
  @ApiProperty({
    description: '文章/微博',
    required: false,
  })
  link?: string;

  /**
   * 父级评论ID
   */
  @ApiProperty({
    description: '父级评论ID',
    required: false,
    default: 1,
  })
  parentId?: ArticleComment['id'];

}
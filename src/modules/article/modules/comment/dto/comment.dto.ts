import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { ValidateThrow } from "src/constants/response";
import { ApiProperty } from "@nestjs/swagger";

import { ArticleComment } from "../entity/comment.entity";

import { ARTICLE_COMMENT } from "../constants";
import { ArticleResponse } from "../../../constants/response.cfg";
import { NotifyEmailResponse } from "src/modules/notify/modules/email/constants/email.response";

/**
 * 发表文章评论 入参
 */
export class SendArticleCommentDto {
  /**
   * 评论内容
   */
  @MinLength(
    ARTICLE_COMMENT.SEND_COMMENT_CONTENT_MIN,
    // ARTICLE_COMMENT.SEND_COMMENT_CONTENT_MAX,
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
  @IsNotEmpty(ValidateThrow(ArticleResponse.SEND_COMMENT_NICKNAME_EMPTY))
  nickname?: string;

  /**
   * 邮箱
   */
  @ApiProperty({
    description: '邮箱',
    required: false,
  })
  @IsEmail({}, ValidateThrow(NotifyEmailResponse.EMAIL_PARAMS_FORMAT))
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


/**
 * 分页 获取文章评论 入参
 */
export class FetchArticleCommentPageDto {
  /**
   * 文章ID
   */
  @ApiProperty({
    description: '文章ID',
  })
  articleId: number;

  /**
   * 文章ID
   */
  @ApiProperty({
    description: '页数',
  })
  page: number;

  /**
   * 文章ID
   */
  @ApiProperty({
    description: '每页个数',
  })
  pageSize: number;
}
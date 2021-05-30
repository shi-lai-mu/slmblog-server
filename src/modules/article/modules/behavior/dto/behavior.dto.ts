import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

import { ValidateThrow } from "src/constants/response";
import { ArticleBehaviorResponse } from "../constants/response.cfg";



/**
 * 踩赞行为
 */
export class LoveLogDto {
  /**
   * 文章ID
   */
  @IsNumber({}, ValidateThrow(ArticleBehaviorResponse.ID_IS_NOT_NUMBER))
  @ApiProperty({
    description: '文章ID'
  })
  articleId: number;

  /**
   * 踩赞状态
   */
  @IsNumber({}, ValidateThrow(ArticleBehaviorResponse.COMMENT_LOVE_TYPE))
  @ApiProperty({
    description: '踩赞状态 (1: 赞， 2: 踩)',
    enum: [1, 2],
  })
  loveType: number;

  /**
   * 评论目标
   */
  @IsNumber({}, ValidateThrow(ArticleBehaviorResponse.COMMENT_LOVE_TARGET))
  @ApiProperty({
    description: '目标类型 (1: 文章， 2: 评论)',
    default: 2,
  })
  target: number;

  /**
   * 评论目标
   */
  @IsNumber({}, ValidateThrow(ArticleBehaviorResponse.COMMENT_LOVE_TARGET_ID))
  @ApiProperty({
    description: '目标Id (如 文章ID/评论ID)',
    default: 0,
  })
  targetId: number;
}
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Length, MinLength } from "class-validator";

import { ARTICLE_CONSTANTS } from "src/constants";
import { ResponseEnum, ValidateThrow } from "src/constants/response";



/**
 * 发布文章
 */
export class ArticleSubmitDto {
  
  /**
   * 标题
   */
  // @MinLength(1, ValidateThrow(ResponseEnum.ARTICLE.SUB_TITLE_EMPTY))
  @Length(ARTICLE_CONSTANTS.TITLE_MIN_LENGTH, ARTICLE_CONSTANTS.TITLE_MAX_LENGTH, ValidateThrow(ResponseEnum.ARTICLE.SUB_TITLE_FORMAT))
  @ApiProperty({
    description: '标题',
    default: '这是一个标题',
  })
  subject: string;

  /**
   * 头图
   */
  @IsNotEmpty(ValidateThrow(ResponseEnum.ARTICLE.SUB_FIRPIC_EMPTY))
  @ApiProperty({
    description: '头图',
    default: '//thirdqq.qlogo.cn/g?b=sdk&k=s3zxCIMMOxfQibT9H8la8zg&s=100?v=1614686512880'
  })
  banner: string;

  /**
   * 内容
   */
  // @MinLength(1, ValidateThrow(ResponseEnum.ARTICLE.SUB_CONTENT_EMPTY))
  @MinLength(ARTICLE_CONSTANTS.CONTENT_MIN_LENGTH, ValidateThrow(ResponseEnum.ARTICLE.SUB_CONTENT_FORMAT))
  @ApiProperty({
    description: '内容',
    default: '这是一个内容, xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  })
  content: string;

  /**
   * 简介
   */
  // @MinLength(1, ValidateThrow(ResponseEnum.ARTICLE.SUB_DESC_EMPTY))
  @Length(ARTICLE_CONSTANTS.DESC_MIN_LENGTH, ARTICLE_CONSTANTS.DESC_MAX_LENGTH, ValidateThrow(ResponseEnum.ARTICLE.SUB_DESC_FORMAT))
  @ApiProperty({
    description: '简介',
    default: '这是一个简介, xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  })
  description: string;

  /**
   * 类目
   */
  // @MinLength(1, ValidateThrow(ResponseEnum.ARTICLE.SUB_CATEGORY_EMPTY))
  @Length(ARTICLE_CONSTANTS.CATEGORY_MIN_LENGTH, ARTICLE_CONSTANTS.CATEGORY_MAX_LENGTH, ValidateThrow(ResponseEnum.ARTICLE.SUB_CATEGORY_FORMAT))
  @ApiProperty({
    description: '类目',
    default: '[1,2]'
  })
  category: string;

  /**
   * 设置
   */
  // @MinLength(1, ValidateThrow(ResponseEnum.ARTICLE.SUB_CATEGORY_EMPTY))
  @IsNotEmpty(ValidateThrow(ResponseEnum.ARTICLE.SUB_SETTING_EMPTY))
  @ApiProperty({
    description: '设置',
    default: '{}',
  })
  setting: string;
}
import { IsNotEmpty, Length, MinLength } from "class-validator";
import { ARTICLE_CONSTANTS } from "src/constants/constants";
import { ResponseEnum, ValidateThrow } from "src/constants/response";

export class ArticleSubmitDto {
  
  /**
   * 标题
   */
  // @MinLength(1, ValidateThrow(ResponseEnum.ARTICLE.SUB_TITLE_EMPTY))
  @Length(ARTICLE_CONSTANTS.TITLE_MIN_LENGTH, ARTICLE_CONSTANTS.TITLE_MAX_LENGTH, ValidateThrow(ResponseEnum.ARTICLE.SUB_TITLE_FORMAT))
  title: string;

  /**
   * 头图
   */
  @IsNotEmpty(ValidateThrow(ResponseEnum.ARTICLE.SUB_FIRPIC_EMPTY))
  firstPicture: string;

  /**
   * 内容
   */
  // @MinLength(1, ValidateThrow(ResponseEnum.ARTICLE.SUB_CONTENT_EMPTY))
  @MinLength(ARTICLE_CONSTANTS.CONTENT_MIN_LENGTH, ValidateThrow(ResponseEnum.ARTICLE.SUB_CONTENT_FORMAT))
  content: string;

  /**
   * 简介
   */
  // @MinLength(1, ValidateThrow(ResponseEnum.ARTICLE.SUB_DESC_EMPTY))
  @Length(ARTICLE_CONSTANTS.DESC_MIN_LENGTH, ARTICLE_CONSTANTS.DESC_MAX_LENGTH, ValidateThrow(ResponseEnum.ARTICLE.SUB_DESC_FORMAT))
  description: string;

  /**
   * 类目
   */
  // @MinLength(1, ValidateThrow(ResponseEnum.ARTICLE.SUB_CATEGORY_EMPTY))
  @Length(ARTICLE_CONSTANTS.CATEGORY_MIN_LENGTH, ARTICLE_CONSTANTS.CATEGORY_MAX_LENGTH, ValidateThrow(ResponseEnum.ARTICLE.SUB_CATEGORY_FORMAT))
  category: string;
}
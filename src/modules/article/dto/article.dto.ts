import { IsUrl, MinLength } from "class-validator";
import { ResponseEnum, Status, ValidateThrow } from "src/constants/response";

export class ArticleSubmitDto {
  
  /**
   * 标题
   */
  @MinLength(1, ValidateThrow(ResponseEnum.ARTICLE.SUB_TITLE_EMPTY))
  title: string;

  /**
   * 头图
   */
  @MinLength(1, ValidateThrow(ResponseEnum.ARTICLE.SUB_FIRPIC_EMPTY))
  firstPicture: string;

  /**
   * 内容
   */
  @MinLength(1, ValidateThrow(ResponseEnum.ARTICLE.SUB_CONTENT_EMPTY))
  content: string;

  /**
   * 简介
   */
  @MinLength(1, ValidateThrow(ResponseEnum.ARTICLE.SUB_DESC_EMPTY))
  description: string;

  /**
   * 类目
   */
  @MinLength(1, ValidateThrow(ResponseEnum.ARTICLE.SUB_CATEGORY_EMPTY))
  category: string;
}
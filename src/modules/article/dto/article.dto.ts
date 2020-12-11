import { IsUrl, MinLength } from "class-validator";
import { ResponseEnum, Status, ValidateThrow } from "src/constants/response";

export class ArticleSubmitDto {
  
  @MinLength(1, ValidateThrow(ResponseEnum.ARTICLE.SUB_TITLE_EMPTY))
  title: string;
  
  @MinLength(1)
  @IsUrl()
  firstPicture: string;

  @MinLength(1)
  content: string;

  @MinLength(1)
  description: string;

  @MinLength(1)
  category: string;
}
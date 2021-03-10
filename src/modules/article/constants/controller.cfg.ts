import { APIPrefix } from "src/constants/constants";



/**
 * 父级控制层前缀
 */
export const MainCPrefix = APIPrefix + 'article';


/**
 * 文章业务 评论 常量
 */
 export class ARTICLE_COMMENT {
  static readonly SEND_COMMENT_CONTENT_MIN: number = 5;   // 内容 最小长度
  static readonly SEND_COMMENT_CONTENT_MAX: number = 150; // 内容 最大长度
}
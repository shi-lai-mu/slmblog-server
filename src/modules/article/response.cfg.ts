import { Status } from "src/constants/response";

/**
 * 文章业务响应
 */
export class ArticleResponse {
  // 发布文章 标题字段 为空
  static readonly SUB_TITLE_EMPTY: Status = { code: 1200, message: '文章标题不能为空' };
}
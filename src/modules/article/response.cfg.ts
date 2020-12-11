import { Status } from "src/constants/response";

/**
 * 文章业务响应
 */
export class ArticleResponse {
  // 发布文章 标题字段 为空
  static readonly SUB_TITLE_EMPTY:    Status = { code: 1200, message: '文章标题不能为空' };
  static readonly SUB_FIRPIC_EMPTY:   Status = { code: 1201, message: '文章头图不能为空' };
  static readonly SUB_CONTENT_EMPTY:  Status = { code: 1202, message: '文章内容不能为空' };
  static readonly SUB_DESC_EMPTY:     Status = { code: 1203, message: '文章简介不能为空' };
  static readonly SUB_CATEGORY_EMPTY: Status = { code: 1204, message: '文章类目不能为空' };
}
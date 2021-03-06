import { ARTICLE_CONSTANTS } from "src/constants/constants";
import { Status } from "src/constants/response";

/**
 * 文章业务响应
 */
export class ArticleResponse {
  static readonly SUB_TITLE_EMPTY:     Status = { code: 1200, message: '文章标题不能为空!' };
  static readonly SUB_TITLE_FORMAT:    Status = { code: 1201, message: `文章标题长度错误，应在${ARTICLE_CONSTANTS.TITLE_MIN_LENGTH}~${ARTICLE_CONSTANTS.TITLE_MAX_LENGTH}字` };
  static readonly SUB_FIRPIC_EMPTY:    Status = { code: 1202, message: '文章头图不能为空!' };
  static readonly SUB_CONTENT_EMPTY:   Status = { code: 1203, message: '文章内容不能为空!' };
  static readonly SUB_CONTENT_FORMAT:  Status = { code: 1204, message: `发布文章内容至少需要${ARTICLE_CONSTANTS.CONTENT_MIN_LENGTH}字!` };
  static readonly SUB_DESC_EMPTY:      Status = { code: 1205, message: '文章简介不能为空!' };
  static readonly SUB_DESC_FORMAT:     Status = { code: 1206, message: `文章简介长度错误，应在${ARTICLE_CONSTANTS.DESC_MIN_LENGTH}~${ARTICLE_CONSTANTS.DESC_MAX_LENGTH}字` };
  static readonly SUB_CATEGORY_FORMAT: Status = { code: 1207, message: `文章类目长度错误，应在${ARTICLE_CONSTANTS.CATEGORY_MIN_LENGTH}~${ARTICLE_CONSTANTS.CATEGORY_MAX_LENGTH}字` };
  static readonly SUB_CATEGORY_EMPTY:  Status = { code: 1208, message: '文章类目不能为空!' };
  static readonly SUB_SETTING_EMPTY:   Status = { code: 1209, message: '文章设置不能为空!' };
  static readonly AC_SUBMIT_ERROR:     Status = { code: 1210, message: '没有发布文章的权限!' };
  static readonly SUB_IS_SENSITIVE:    Status = { code: 1211, message: '发布内容检测的敏感词 [%s]' };
  static readonly SUB_ARTICLE_ERROR:   Status = { code: 1212, message: '文章发布失败!' };
  static readonly STATE_FAILED:        Status = { code: 1213, message: '该文章未通过审核!' };
  static readonly STATE_EXAMINE:       Status = { code: 1214, message: '文章正在审核中...请耐心等待!' };
  static readonly STATE_ISDELETE:      Status = { code: 1215, message: '非常抱歉，该文章已被删除!' };
  static readonly STATE_NOT_EXISTS:    Status = { code: 1216, message: '未找到有效的文章资源!' };
  static readonly STATE_ABNORMAL:      Status = { code: 1217, message: '文章状态异常，请稍后再试!' };

  static readonly ID_IS_NOT_NUMBER:    Status = { code: 1218, message: '文章ID必须为数值!' };
  static readonly COMMENT_LOVE_TYPE:   Status = { code: 1219, message: '行为状态必须为数值!' };
  static readonly COMMENT_LOVE_TARGET: Status = { code: 1220, message: '行为目标必须为数值!' };
  static readonly REPEAT_LOVE_ACTION:  Status = { code: 1221, message: '无法重复记录此操作!' };
}

/**
 * 文章类目响应
 */
export class ArticleCategoryResponse {
  static readonly CREATE_EXISTS: Status = { code: 1250, message: '创建的类目名已存在!' };
}
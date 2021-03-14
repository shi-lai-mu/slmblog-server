import { Status } from "src/constants/response";
import { ARTICLE_CONSTANTS } from "src/constants/constants";
import { ARTICLE_COMMENT } from "./controller.cfg";



/**
 * 文章业务 响应
 */
export class ArticleResponse {
  // 文章标题为空
  static readonly SUB_TITLE_EMPTY:             Status = { code: 1200, message: '文章标题不能为空!' };
  // 文章长度错误
  static readonly SUB_TITLE_FORMAT:            Status = { code: 1201, message: `文章标题长度错误，应在${ARTICLE_CONSTANTS.TITLE_MIN_LENGTH}~${ARTICLE_CONSTANTS.TITLE_MAX_LENGTH}字` };
  // 文章头图为空
  static readonly SUB_FIRPIC_EMPTY:            Status = { code: 1202, message: '文章头图不能为空!' };
  // 文章内容为空
  static readonly SUB_CONTENT_EMPTY:           Status = { code: 1203, message: '文章内容不能为空!' };
  // 文章内容长度错误
  static readonly SUB_CONTENT_FORMAT:          Status = { code: 1204, message: `发布文章内容至少需要${ARTICLE_CONSTANTS.CONTENT_MIN_LENGTH}字!` };
  // 文章简介为空
  static readonly SUB_DESC_EMPTY:              Status = { code: 1205, message: '文章简介不能为空!' };
  // 文章简介长度错误
  static readonly SUB_DESC_FORMAT:             Status = { code: 1206, message: `文章简介长度错误，应在${ARTICLE_CONSTANTS.DESC_MIN_LENGTH}~${ARTICLE_CONSTANTS.DESC_MAX_LENGTH}字` };
  // 文章类目长度错误
  static readonly SUB_CATEGORY_FORMAT:         Status = { code: 1207, message: `文章类目长度错误，应在${ARTICLE_CONSTANTS.CATEGORY_MIN_LENGTH}~${ARTICLE_CONSTANTS.CATEGORY_MAX_LENGTH}字` };
  // 文章类目为空
  static readonly SUB_CATEGORY_EMPTY:          Status = { code: 1208, message: '文章类目不能为空!' };
  // 文章设置为空
  static readonly SUB_SETTING_EMPTY:           Status = { code: 1209, message: '文章设置不能为空!' };
  // 无文章发布权
  static readonly AC_SUBMIT_ERROR:             Status = { code: 1210, message: '没有发布文章的权限!' };
  // 文章 内容/标题/简介 内包含敏感词
  static readonly SUB_IS_SENSITIVE:            Status = { code: 1211, message: '发布内容检测到敏感词 [%s]' };
  // 未知原因导致文章发布失败
  static readonly SUB_ARTICLE_ERROR:           Status = { code: 1212, message: '文章发布失败!' };
  // 文章审核未通过
  static readonly STATE_FAILED:                Status = { code: 1213, message: '该文章未通过审核!' };
  // 文章审核提醒
  static readonly STATE_EXAMINE:               Status = { code: 1214, message: '文章正在审核中...请耐心等待!' };
  // 文章已被删除提醒
  static readonly STATE_ISDELETE:              Status = { code: 1215, message: '非常抱歉，该文章已被删除!' };
  // 文章ID指向文章不存在
  static readonly STATE_NOT_EXISTS:            Status = { code: 1216, message: '未找到有效的文章资源!' };
  // 文章状态异常
  static readonly STATE_ABNORMAL:              Status = { code: 1217, message: '文章状态异常，请稍后再试!' };
  // 行为记录重复
  static readonly REPEAT_LOVE_ACTION:          Status = { code: 1221, message: '无法重复记录此操作!' };
  // 评论内容长度不对
  static readonly SEND_COMMENT_CONTENT_LENGTH: Status = { code: 1222, message: `评论内容长度错误，字数应在${ARTICLE_COMMENT.SEND_COMMENT_CONTENT_MIN}~${ARTICLE_COMMENT.SEND_COMMENT_CONTENT_MAX}之间!` };
  // 评论 邮箱为空
  // static readonly SEND_COMMENT_EMAIL_EMPTY:    Status = { code: 1223, message: '邮箱不能为空!' }; TODO: 注意补上CODE
  // 评论 昵称为空
  static readonly SEND_COMMENT_NICKNAME_EMPTY: Status = { code: 1224, message: '昵称不能为空!' };
  // 在父级下留子评论
  static readonly SEND_SUB_COMMENT_PARENT_NOT: Status = { code: 1225, message: '父级评论不存在!' };
}

/**
 * 文章类目响应
 */
export class ArticleCategoryResponse {
  // 类目创建失败 类目名已存在
  static readonly CREATE_EXISTS: Status = { code: 1250, message: '创建的类目名已存在!' };
}


/**
 * 文章业务 行为 响应
 */
export class ArticleBehaviorResponse {
  // 文章ID非数值 类型错误
  static readonly ID_IS_NOT_NUMBER:    Status = { code: 1218, message: '文章ID必须为数值!' };
  // 行为状态非数值 类型错误
  static readonly COMMENT_LOVE_TYPE:   Status = { code: 1219, message: '行为状态必须为数值!' };
  // 行为目标非数值 类型错误
  static readonly COMMENT_LOVE_TARGET: Status = { code: 1220, message: '行为目标必须为数值!' };
}
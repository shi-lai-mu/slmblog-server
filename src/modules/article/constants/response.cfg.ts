import { Status } from "src/constants/response";
import { ARTICLE_CONSTANTS } from "src/constants";
import { ARTICLE_COMMENT } from "../modules/comment/constants";
import { RegisterResponse } from "src/plugins/slm/resCodeDoc/decorators";


/**
 * 文章业务 响应
 */
@RegisterResponse({
  name: '文章业务',
  startCode: 1200,
})
export class ArticleResponse {
  // 文章标题为空
  static readonly SUB_TITLE_EMPTY:             Status = { codeType: 'P', message: '文章标题不能为空!' };
  // 文章长度错误
  static readonly SUB_TITLE_FORMAT:            Status = { codeType: 'P', message: `文章标题长度错误，应在${ARTICLE_CONSTANTS.TITLE_MIN_LENGTH}~${ARTICLE_CONSTANTS.TITLE_MAX_LENGTH}字` };
  // 文章头图为空
  static readonly SUB_FIRPIC_EMPTY:            Status = { codeType: 'P', message: '文章头图不能为空!' };
  // 文章内容为空
  static readonly SUB_CONTENT_EMPTY:           Status = { codeType: 'P', message: '文章内容不能为空!' };
  // 文章内容长度错误
  static readonly SUB_CONTENT_FORMAT:          Status = { codeType: 'P', message: `发布文章内容至少需要${ARTICLE_CONSTANTS.CONTENT_MIN_LENGTH}字!` };
  // 文章简介为空
  static readonly SUB_DESC_EMPTY:              Status = { codeType: 'P', message: '文章简介不能为空!' };
  // 文章简介长度错误
  static readonly SUB_DESC_FORMAT:             Status = { codeType: 'P', message: `文章简介长度错误，应在${ARTICLE_CONSTANTS.DESC_MIN_LENGTH}~${ARTICLE_CONSTANTS.DESC_MAX_LENGTH}字` };
  // 文章类目长度错误
  static readonly SUB_CATEGORY_FORMAT:         Status = { codeType: 'P', message: `文章类目长度错误，应在${ARTICLE_CONSTANTS.CATEGORY_MIN_LENGTH}~${ARTICLE_CONSTANTS.CATEGORY_MAX_LENGTH}字` };
  // 文章类目为空
  static readonly SUB_CATEGORY_EMPTY:          Status = { codeType: 'P', message: '文章类目不能为空!' };
  // 文章设置为空
  static readonly SUB_SETTING_EMPTY:           Status = { codeType: 'P', message: '文章设置不能为空!' };
  // 无文章发布权
  static readonly AC_SUBMIT_ERROR:             Status = { codeType: 'P', message: '没有发布文章的权限!' };
  // 文章 内容/标题/简介 内包含敏感词
  static readonly SUB_IS_SENSITIVE:            Status = { codeType: 'B', message: '发布内容检测到敏感词 [%s]' };
  // 未知原因导致文章发布失败
  static readonly SUB_ARTICLE_ERROR:           Status = { codeType: 'D', message: '文章发布失败!' };
  // 文章审核未通过
  static readonly STATE_FAILED:                Status = { codeType: 'B', message: '该文章未通过审核!' };
  // 文章审核提醒
  static readonly STATE_EXAMINE:               Status = { codeType: 'B', message: '文章正在审核中...请耐心等待!' };
  // 文章已被删除提醒
  static readonly STATE_ISDELETE:              Status = { codeType: 'B', message: '非常抱歉，该文章已被删除!' };
  // 文章ID指向文章不存在
  static readonly STATE_NOT_EXISTS:            Status = { codeType: 'B', message: '未找到有效的文章资源!' };
  // 文章状态异常
  static readonly STATE_ABNORMAL:              Status = { codeType: 'B', message: '文章状态异常，请稍后再试!' };
  // 行为记录重复
  static readonly REPEAT_LOVE_ACTION:          Status = { codeType: 'B', message: '无法重复记录此操作!' };
  // 评论内容长度不对
  static readonly SEND_COMMENT_CONTENT_LENGTH: Status = { codeType: 'P', message: `评论内容长度错误，字数应在${ARTICLE_COMMENT.SEND_COMMENT_CONTENT_MIN}字以上!` };
  // 评论 邮箱为空
  // static readonly SEND_COMMENT_EMAIL_EMPTY:    Status = { codeType: 'O', message: '邮箱不能为空!' }; TODO: 注意补上CODE
  // 评论 昵称为空
  static readonly SEND_COMMENT_NICKNAME_EMPTY: Status = { codeType: 'P', message: '昵称不能为空!' };
  // 在父级下留子评论
  static readonly SEND_SUB_COMMENT_PARENT_NOT: Status = { codeType: 'P', message: '父级评论不存在!' };
  // 在父级下留子评论
  static readonly SEND_SUB_NOT_COMMENT_PARENT: Status = { codeType: 'B', message: '不能对子评论进行评论!' };
  // 文章筛选类id型错误
  static readonly FILTER_IDS_TYPE:             Status = { codeType: 'P', message: '文章筛选ID只能为数组字符串或者数值!' };
  // 评论失败
  static readonly SEND_COMMENT_ERROR:          Status = { codeType: 'B', message: '评论失败，未知原因!' };
  // 点赞失败，评论不存在
  static readonly LIKE_COMMENT_INVALID:        Status = { codeType: 'B', message: '行为评论不存在!' };
}

/**
 * 文章类目响应
 */
export class ArticleCategoryResponse {
  // 类目创建失败 类目名已存在
  static readonly CREATE_EXISTS: Status = { codeType: 'O', message: '创建的类目名已存在!' };
}
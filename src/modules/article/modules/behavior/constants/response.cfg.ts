
import { Status } from "src/constants/response";
import { RegisterResponse } from "src/plugins/slm/resCodeDoc/decorators";


/**
 * 文章业务 行为 响应
 */
@RegisterResponse({
  name: '文章业务',
  startCode: 1200,
})
 export class ArticleBehaviorResponse {
  // 文章ID非数值 类型错误
  static readonly ID_IS_NOT_NUMBER:       Status = { codeType: 'P', message: '文章ID必须为数值!' };
  // 行为状态非数值 类型错误
  static readonly COMMENT_LOVE_TYPE:      Status = { codeType: 'P', message: '行为状态必须为数值!' };
  // 行为类型非数值 类型错误
  static readonly COMMENT_LOVE_TARGET:    Status = { codeType: 'P', message: '行为类型必须为数值!' };
  // 行为目标非数值 类型错误
  static readonly COMMENT_LOVE_TARGET_ID: Status = { codeType: 'P', message: '行为目标必须为数值!' };
}
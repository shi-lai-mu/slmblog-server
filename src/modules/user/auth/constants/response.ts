import { Status } from 'src/constants/response';
import { RegisterResponse } from 'src/plugins/slm/resCodeDoc/decorators';



/**
 * 用户类 认证模块 响应信息
 */
@RegisterResponse({
  name: '用户业务',
  startCode: 1100,
  extends: '认证模块',
})
export class UserAuthResponse {
  // 置换JWT：未知原因
  static readonly REFRESH_JWT_ERROR: Status = { codeType: 'O', message: '置换JWT失败，未知原因!' };
  // 置换JWT：参数异常
  static readonly REFRESH_JWT_QUERY: Status = { codeType: 'P', message: '置换JWT失败，必要参数不存在!' };
  // 置换JWT：无效令牌
  static readonly REFRESH_JWT_INVAL: Status = { codeType: 'P', message: '置换JWT失败，无效令牌!' };
}
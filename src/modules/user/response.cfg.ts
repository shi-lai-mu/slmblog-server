import { USER_CONSTANTS } from '../../constants/constants';
import { Status } from '../../constants/response';

/**
 * 用户类 响应信息
 */
export class UserResponse {
  // 账号为空
  static readonly ACCOUNT_EMPTY: Status =   { code: 1100, message: '账号不能为空！' };
  // 密码为空
  static readonly PASSWORD_EMPTY: Status =  { code: 1101, message: '密码不能为空！' };
  // 账号格式问题
  static readonly ACCOUNT_FORMAT: Status =  { code: 1102, message: `账号 格式不正确，只能在${USER_CONSTANTS.ACCOUNT_MIN_LENGTH}-${USER_CONSTANTS.ACCOUNT_MAX_LENGTH}之间，只能包含中英文和下划线。` };
  // 密码格式问题
  static readonly PASSWORD_FORMAT: Status = { code: 1103, message: `密码 格式不正确，只能在${USER_CONSTANTS.PASSWORD_MIN_LENGTH}-${USER_CONSTANTS.PASSWORD_MAX_LENGTH}之间。` };
  // 账号已注册
  static readonly REG_AC_EXISTS: Status =   { code: 1104, message: '账号已被注册!' };
  // 账号或密码错误
  static readonly LOG_AC_PW_ERROR: Status = { code: 1105, message: '账号或密码错误!' };
  // 账号或密码错误
  static readonly FIND_USER_NULL: Status =  { code: 1106, message: '用户信息不存在!' };
  
}
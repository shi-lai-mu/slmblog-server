import { USER_CONSTANTS } from '../../../constants/constants';
import { Status } from '../../../constants/response';

/**
 * 用户类 响应信息
 */
export class UserResponse {
  // 账号为空
  static readonly ACCOUNT_EMPTY:     Status = { code: 1100, message: '账号不能为空！' };
  // 密码为空
  static readonly PASSWORD_EMPTY:    Status = { code: 1101, message: '密码不能为空！' };
  // 账号格式问题
  static readonly ACCOUNT_FORMAT:    Status = { code: 1102, message: `账号 格式不正确，只能在${USER_CONSTANTS.ACCOUNT_MIN_LENGTH}-${USER_CONSTANTS.ACCOUNT_MAX_LENGTH}之间，只能包含中英文和下划线。` };
  // 密码格式问题
  static readonly PASSWORD_FORMAT:   Status = { code: 1103, message: `密码 格式不正确，只能在${USER_CONSTANTS.PASSWORD_MIN_LENGTH}-${USER_CONSTANTS.PASSWORD_MAX_LENGTH}之间。` };
  // 账号已注册
  static readonly REG_AC_EXISTS:     Status = { code: 1104, message: '账号已被注册!' };
  // 账号或密码错误
  static readonly LOG_AC_PW_ERROR:   Status = { code: 1105, message: '账号或密码错误!' };
  // 用户信息不存在
  static readonly FIND_USER_NULL:    Status = { code: 1106, message: '用户信息不存在!' };
  // 重新登录：已在其他设备上登录
  static readonly UNLOG_BUSY_LINE:   Status = { code: 1107, message: '登录状态失效，请重新登录!' };
  // 登录账号异常：已被冻结或转移
  static readonly ACOOUNT_ABNORMAL:  Status = { code: 1108, message: '账号状态异常，已被冻结或未激活!' };
  // 查看账号异常：已被冻结或转移
  static readonly INFO_AC_ABNORMAL:  Status = { code: 1109, message: '目标账号处于冻结状态!' };
  // 查看账号异常：账号未激活
  static readonly AC_NO_ACTIVATION:  Status = { code: 1110, message: '账号状态异常，未激活!' };
  // 置换JWT：未知原因
  static readonly REFRESH_JWT_ERROR: Status = { code: 1111, message: '置换JWT失败，未知原因!' };
  // 置换JWT：参数异常
  static readonly REFRESH_JWT_QUERY: Status = { code: 1112, message: '置换JWT失败，必要参数不存在!' };
  // 置换JWT：无效令牌
  static readonly REFRESH_JWT_INVAL: Status = { code: 1113, message: '置换JWT失败，无效令牌!' };
}

/**
 * 配置类 响应信息
 */
export class UserConfigResponse {
  // 保存信息为空
  static readonly SAVE_JSON_EMPTY:   Status = { code: 1300, message: '保存信息不能为空!' };
  // 配置保存失败
  static readonly SAVE_INSERT_ERROR: Status = { code: 1301, message: '配置保存失败，请稍后再试!' };
  // 配置保存失败
  static readonly SAVE_UPDATE_ERROR: Status = { code: 1302, message: '配置保存失败，请稍后再试!' };
}
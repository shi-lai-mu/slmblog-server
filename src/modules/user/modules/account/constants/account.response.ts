import { Status } from 'src/constants/response';
import { RegisterResponse } from 'src/plugins/slm/resCodeDoc/decorators';
import { USER_ACCOUNT_CONSTANTS } from '.';



const { ACCOUNT_MIN_LENGTH, ACCOUNT_MAX_LENGTH, PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH } = USER_ACCOUNT_CONSTANTS;
/**
 * 用户类 账号模块 响应信息
 */
@RegisterResponse({
  name: '用户业务',
  startCode: 1100,
  extends: '账号模块',
})
export class UserAccountResponse {
  // 账号为空
  static readonly ACCOUNT_EMPTY:     Status = { codeType: 'P', message: '账号不能为空!' };
  // 密码为空
  static readonly PASSWORD_EMPTY:    Status = { codeType: 'P', message: '密码不能为空!' };
  // 验证码为空
  static readonly CODE_EMPTY:        Status = { codeType: 'P', message: '验证码为空!' };
  // 验证码长度错误
  static readonly CODE_LENGTH:       Status = { codeType: 'P', message: '验证码长度错误!' };
  // 账号格式问题
  static readonly ACCOUNT_FORMAT:    Status = { codeType: 'P', message: `账号 格式不正确，只能在${ACCOUNT_MIN_LENGTH}-${ACCOUNT_MAX_LENGTH}之间，只能包含中英文和下划线。` };
  // 密码格式问题
  static readonly PASSWORD_FORMAT:   Status = { codeType: 'P', message: `密码 格式不正确，只能在${PASSWORD_MIN_LENGTH}-${PASSWORD_MAX_LENGTH}之间。` };
  // 昵称格式不正确
  static readonly NICKNAME_FORMAT:   Status = { codeType: 'P', message: '昵称格式不正确，不能包含非中英文、数字、下划线!' };

  // 账号已注册
  static readonly REG_AC_EXISTS:     Status = { codeType: 'B', message: '账号已被注册!' };
  // 邮箱已被占用
  static readonly REG_EMAIL_EXISTS:  Status = { codeType: 'B', message: '邮箱已被其他账号占用!' };
  // 账号或密码错误
  static readonly LOG_AC_PW_ERROR:   Status = { codeType: 'B', message: '账号或密码错误!' };

  // 用户信息不存在
  static readonly FIND_USER_NULL:    Status = { codeType: 'B', message: '目标用户不存在!' };

  // 重新登录：已在其他设备上登录
  static readonly UNLOG_BUSY_LINE:   Status = { codeType: 'B', message: '登录状态失效，请重新登录!' };
  // 登录账号异常：已被冻结或转移
  static readonly ACOOUNT_ABNORMAL:  Status = { codeType: 'B', message: '账号状态异常，已被冻结或未激活!' };
  // 查看账号异常：已被冻结或转移
  static readonly INFO_AC_ABNORMAL:  Status = { codeType: 'B', message: '目标账号处于冻结状态!' };
  // 查看账号异常：账号未激活
  static readonly AC_NO_ACTIVATION:  Status = { codeType: 'B', message: '账号状态异常，未激活!' };
  // 登录账号异常：已被冻
  static readonly ACOOUNT_BANLIST:   Status = { codeType: 'B', message: '账号状态异常，已冻结!' };
  // 登录账号异常：未激活
  static readonly ACOOUNT_INACTIVE:  Status = { codeType: 'B', message: '账号未激活，请先验证邮箱!' };
  // 未登录账号
  static readonly ACOOUNT_NOT_LOGIN: Status = { codeType: 'B', message: '必须登录账号才能进行此操作!' };
}
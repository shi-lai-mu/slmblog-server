import {      Status } from "src/constants/response";
import { RegisterResponse } from "src/plugins/slm/resCodeDoc/decorators";
import { formatJetlag } from "src/utils/collection";
import { NOTIFY_EMAIL } from "./controller.cfg";



const { SEND_COOLING_S, SEND_COOLING_COUNT, SEND_COOLING_TIME } = NOTIFY_EMAIL;
/**
 * 通知业务 响应
 */
// @RegisterResponse({
//   name: '通知业务',
//   startCode: 1400,
// })
export class NotifyResponse {
  // 邮箱发送是出错
  static readonly EMAIL_SEND_ERROR:           Status = { code: 1400, message: '邮箱业务繁忙!' };
  // 邮件发送次数上限
  static readonly EMAIL_SEND_MAX_COUNT:       Status = { code: 1401, message: `发送次数已达上限，${formatJetlag(SEND_COOLING_S * 1000)}内只能发送${SEND_COOLING_COUNT}次!` };
  // 邮件发送频繁
  static readonly EMAIL_SEND_OFTEN_MAX:       Status = { code: 1402, message: `请勿频繁发送，${formatJetlag(SEND_COOLING_TIME, '分钟')}内只能发送1次!` };
  // 邮箱号处于拒收名单内 无法发送
  static readonly EMAIL_IN_BANLIST:           Status = { code: 1403, message: '该邮箱已拒绝接收本站邮件!' };
  // 邮箱为空
  static readonly EMAIL_PARAMS_EMPTY:         Status = { code: 1404, message: '邮箱不能为空!' };
  // 邮箱格式不正确
  static readonly EMAIL_PARAMS_FORMAT:        Status = { code: 1405, message: '请输入正确的邮箱!' };
  // 校验邮箱ID为空
  static readonly EMAIL_VALIDATE_ID_EMPTY:    Status = { code: 1406, message: '校验邮箱ID不能为空!' };
  // 校验邮箱ID格式错误
  static readonly EMAIL_VALIDATE_ID_FORMAT:   Status = { code: 1407, message: '校验邮箱ID格式错误!' };
  // 校验邮箱UUID为空
  static readonly EMAIL_VALIDATE_UUID_EMPTY:  Status = { code: 1408, message: '校验邮箱UUID不能为空!' };
  // 校验邮箱UUID格式错误
  static readonly EMAIL_VALIDATE_UUID_FORMAT: Status = { code: 1409, message: '校验邮箱UUID格式错误!' };
  // 校验邮箱UUID格式错误
  static readonly EMAIL_VALIDATE_UUID_ERROR:  Status = { code: 1410, message: '校验失败，验证序列错误或已失效!' };
  // 邮箱更新失败
  static readonly ACCOUNT_EMAIL_UPDATE_ERROR: Status = { code: 1411, message: '账号邮箱修改失败!' };
  // 邮箱更新失败: 邮箱相同
  static readonly ACCOUNT_EMAIL_SAME:         Status = { code: 1412, message: '不能绑定相同邮箱或邮箱已被修改!' };
  // 邮件发送失败L: 发送目标未注册
  static readonly EMAIL_SEND_CUURENT_NOT_REG: Status = { code: 1413, message: '发送目标未注册!' };
}
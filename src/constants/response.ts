import { USER_CONSTANTS } from './constants';
import { UserResponse } from '../modules/user/response.cfg';
import { ResBaseException } from 'src/core/exception/res.exception';

/**
 * 响应枚举类
 */
export class ResponseEnum {
  static readonly SUCCESS:              Status = { code: 0,    message: 'success' };
  static readonly ERROR:                Status = { code: 1,    message: 'fail' };
  static readonly PARAMS:               Status = { code: 1000, message: '参数错误' };
  static readonly PARAMS_GUARDS:        Status = { code: 1001, message: '参数错误' };
  static readonly FREQUENTLY:           Status = { code: 1002, message: '请求过于频繁' };
  static readonly UNAUTHORIZED_INVALID: Status = { code: 1003, message: '授权失败，令牌无效!' }
  static readonly UNAUTHORIZED_EXPIRED: Status = { code: 1004, message: '授权失败，身份已过期!' }
  static readonly TIME_OUT_LONG:        Status = { code: 1005, message: '服务器处理超时，请稍后再试!' }

  // 逻辑层请求响应
  static readonly USER = UserResponse;
}



/**
 * 可枚举状态值
 */
const ResponseEnumKey: keyof typeof ResponseEnum = 'ERROR';

/**
 * 响应体
 */
export class ResponseBody extends ResponseEnum {

  
  /**
   * 获取错误内容
   * @param enums 错误枚举值
   */
  static getMessage(enums: typeof ResponseEnumKey): string {
    return (<Status>ResponseEnum[enums]).message || '';
  }


  /**
   * 获取错误CODE
   * @param enums 错误枚举值
   */
  static getCode(enums: typeof ResponseEnumKey): number {
    return (<Status>ResponseEnum[enums]).code ?? -1;
  }


  /**
   * 获取完整的响应体
   */
  static status(
    enums: typeof ResponseEnumKey,
    success?: boolean,
    result: any = '',
    message?: string,
    code?: number,
  ): Status {
    return {
      code: code || ResponseBody.getCode(enums),
      message: message || ResponseBody.getMessage(enums),
      success: success !== undefined ? success : enums === 'SUCCESS',
      result,
    };
  }


  /**
   * 自适应返回体
   * @param result 响应
   */
  static send(result) {
    if (result instanceof ResBaseException) {
      throw result;
    }
    if (result.code !== undefined && result.code !== 0 && result.message) {
      return ResponseBody.status('ERROR', false, '', result.message, result.code);
    }
    return ResponseBody.status('SUCCESS', true, result, '');
  }
}


/**
 * 响应状态
 */
export interface Status {
  /**
   * 响应码
   */
  code: number;
  /**
   * 响应内容
   */
  message: string;
  /**
   * 执行状态
   */
  success?: boolean;
  /**
   * 执行结果
   */
  result?: any;
}


/**
 * 错误响应体
 */
export interface ErrorStatus extends Status {
  /**
   * 追踪UUID
   */
  uuid: string;
  /**
   * 报错时间
   */
  time: string;
}
import { UserConfigResponse, UserResponse } from '../modules/user/constants/response.cfg';
import { ConstantsResponse } from 'src/interface/gloabl.interface';
import { ResBaseException } from 'src/core/exception/res.exception';
import { isJsonString } from 'src/utils/collection';
import { ArticleResponse } from 'src/modules/article/constants/response.cfg';

export type Status = ConstantsResponse.Status;
export type ErrorStatus = ConstantsResponse.ErrorStatus;

/**
 * 响应枚举类
 */
export class ResponseEnum {
  // 成功学院
  static readonly SUCCESS:              Status = { code: 0,    message: 'success' };
  // 错误/无法识别的错误
  static readonly ERROR:                Status = { code: 1,    message: 'fail' };
  // 404资源不存在
  static readonly NOT_FOUND:            Status = { code: 404,  message: '未找到有效的资源' };
  // 身份过期/无效
  static readonly UNAUTHORIZED:         Status = { code: 401,  message: '身份授权失效' };
  // 服务器内部 出错/报错
  static readonly SERVER_ERROR:         Status = { code: 500,  message: '服务器出错', result: '非常抱歉错误信息已记录，我们将尽快解决这类问题！' };
  // 入参错误
  static readonly PARAMS:               Status = { code: 1000, message: '参数错误' };
  // 全局入参错误检测
  static readonly PARAMS_GUARDS:        Status = { code: 1001, message: '参数错误' };
  // 频繁访问检测
  static readonly FREQUENTLY:           Status = { code: 1002, message: '请求过于频繁' };
  // 无效的身份进行访问
  static readonly UNAUTHORIZED_INVALID: Status = { code: 1003, message: '授权失败，令牌无效!' };
  // 身份过期
  static readonly UNAUTHORIZED_EXPIRED: Status = { code: 1004, message: '授权失败，身份已过期!' };
  // 服务器响应超出一定时长
  static readonly TIME_OUT_LONG:        Status = { code: 1005, message: '服务器处理超时，请稍后再试!' };
  // 越权请求接口
  static readonly NOT_PERMISSION:       Status = { code: 1006, message: '无权进行此操作, 至少需要权限组 [%s]!' };


  // 入参非URL格式
  static readonly PARAMS_IS_NOT_URL:    Status = { code: 1050, message: '非URL格式!' };
  // 入参非数值格式
  static readonly PARAMS_PAGE_OR_COUNT: Status = { code: 1051, message: '传入页数或列数非正常数值!' };
  // 入参非指定参数列表内的值
  static readonly PARAMS_VALUES:        Status = { code: 1052, message: '传入参数%s为无效值%s!' };
  // 传入的json在解析时出错
  static readonly PARAMS_NOT_JSON_STR:  Status = { code: 1053, message: '传入参数非标准的JSON字符串!' };

  /**
   * 逻辑层请求响应
   */
  static readonly USER    = UserResponse;       // 用户业务 1100
  static readonly ARTICLE = ArticleResponse;    // 文章业务 1200
  static readonly CONFIG  = UserConfigResponse; // 配置业务 1300


  static THROW(Error: Status) {
    throw new ResBaseException(Error);
  }
}


/**
 * 校验参数时message伪装
 * @param Error 错误内容
 */
export const ValidateThrow = Error => ({
  message: () => {
    throw new ResBaseException(Error);
  }
});


/**
 * 检验是否为json字符串
 * @param jsonString json字符串
 */
export const ValidateIsJsonString = (jsonString: string) => {
  if (jsonString && !isJsonString(jsonString)) ResponseEnum.THROW(ResponseEnum.PARAMS_NOT_JSON_STR);
  return true;
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


  /**
   * 直接抛出错误
   */
  static throw(responseEnum: Status) {
    throw new ResBaseException(responseEnum);
  }
}


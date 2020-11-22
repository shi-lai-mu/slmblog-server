/**
 * 响应枚举类
 */
export class ResponseEnum {
  static readonly SUCCESS:       Status = { code: 0,    message: 'success' };
  static readonly ERROR:         Status = { code: 1,    message: 'fail' };
  static readonly PARAMS:        Status = { code: 1000, message: '参数错误' };
  static readonly PARAMS_GUARDS: Status = { code: 1001, message: '参数错误' };


}

/**
 * 可枚举状态值
 */
const ResponseEnumKey: keyof typeof ResponseEnum = 'ERROR';

/**
 * 响应体
 */
export class Response extends ResponseEnum {

  
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
    return (<Status>ResponseEnum[enums]).code || -1;
  }


  /**
   * 获取完整的响应体
   */
  static status(
    enums: typeof ResponseEnumKey,
    success?: boolean,
    result: any = '',
  ): Status {
    return {
      code: Response.getCode(enums),
      message: Response.getMessage(enums),
      success: success !== undefined ? success : enums === 'SUCCESS',
      result,
    };
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
import { ResponseBody, ResponseEnum } from "src/constants/response";

/**
 * 生成UUID
 * @param format 格式
 * - 默认格式前10位为校验码，对应生成时时间戳前10位不包括毫秒
 */
export const generateUUID = (format: string = '#校验码#-xxxx-yxxx-xxxx-xxxxxxxxxxxx') => {
  let d = new Date().getTime();
  return format
    .replace('#校验码#', d.toString().substr(0, 10))
    .replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}


/**
 * 获取请求方IP [没获取到返回空字符串]
 * @param req 请求
 */
export const getClientIP = (req): string => {
  const findIP = (req.headers['x-real-for']
    || req.connection.remoteAddress
    || req.socket.remoteAddress
    || req.connection.socket.remoteAddress
    || '').match(/\d+\.\d+\.\d+\.\d+/);
  return findIP ? findIP[0] : '';
}


/**
 * 传入参数校验类
 */
export class ValidateParams {

  /**
   * 检测是否为正确的页数或者列数格式
   */
  static isPageOrCount(page: string | number, count: string | number) {
    !/^\d+$/.test(String(page) + count) && ResponseBody.throw(ResponseEnum.PARAMS_PAGE_OR_COUNT);
    return this;
  }


  /**
   * 检测传入值是否在指定范围内
   * @param data   传入的值,如入参 val1 变量请传入 { val1 } 以便追踪变量名
   * @param values 值范围
   */
  static isThisValues(data: { [key: string]: string | number }, values: Array<string | number>) {
    const [ key ] = Object.keys(data);
    if (!values.includes(data[key])) {
      const ERROR = ResponseEnum.PARAMS_VALUES;
      ERROR.message = ERROR.message.replace('%s', key).replace('%s', String(data[key]));
      ResponseBody.throw(ERROR);
    }
    return this;
  }
}


/**
 * 返回当前页数
 */
export const skipPage = (page: number, count: number) => (page - 1) * count;


/**
 * 返回列表响应信息
 */
export const responseList = <T>(page: number, count: number, list: T, total: number) => {
  return {
    list,
    page: Number(page),
    count: Number(count),
    total: Number(total),
  };
};


/**
 * 判断是否为标准的JSON字符串
 * @param jsonString json字符串
 */
export const isJsonString = (jsonString: string) => {
  try {
    jsonString = JSON.parse(jsonString);
    return true;
  } catch (_err) {
    return false;
  }
}
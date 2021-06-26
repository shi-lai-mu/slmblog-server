import { ResponseBody, ResponseEnum } from 'src/constants/response'

/**
 * 生成UUID
 * @param format 格式
 * - 默认格式前10位为校验码，对应生成时时间戳前10位不包括毫秒
 */
export const generateUUID = (format = '#校验码#-xxxx-yxxx-xxxx-xxxxxxxxxxxx') => {
  let d = new Date().getTime()
  return format.replace('#校验码#', d.toString().substr(0, 10)).replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

/**
 * 获取请求方IP [没获取到返回空字符串]
 * @param req 请求
 */
export const getClientIP = (req): string => {
  const findIP = (
    req.headers['x-real-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress ||
    ''
  ).match(/\d+\.\d+\.\d+\.\d+/)
  return findIP ? findIP[0] : ''
}

/**
 * 传入参数校验类
 */
export class ValidateParams {
  /**
   * 检测是否为正确的页数或者列数格式
   */
  static isPageOrCount(page: string | number, count: string | number) {
    !/^\d+$/.test(String(page) + count) && ResponseBody.throw(ResponseEnum.PARAMS_PAGE_OR_COUNT)
    return this
  }

  /**
   * 检测传入值是否在指定范围内
   * @param data   传入的值,如入参 val1 变量请传入 { val1 } 以便追踪变量名
   * @param values 值范围
   */
  static isThisValues(data: { [key: string]: string | number }, values: Array<string | number>) {
    const [key] = Object.keys(data)
    if (!values.includes(data[key])) {
      const ERROR = ResponseEnum.PARAMS_VALUES
      ERROR.message = ERROR.message.replace('%s', key).replace('%s', String(data[key]))
      ResponseBody.throw(ERROR)
    }
    return this
  }
}

/**
 * 返回当前页数
 */
export const skipPage = (page: number, count: number) => (page - 1) * count

/**
 * 返回列表响应信息
 */
export const responseList = <T>(page: number, count: number, list: T, total: number) => {
  return {
    list,
    page: Number(page),
    pageSize: Number(count),
    total: Number(total),
  }
}

/**
 * 判断是否为标准的JSON字符串
 * @param jsonString json字符串
 */
export const isJsonString = (jsonString: string) => {
  try {
    return JSON.parse(jsonString)
  } catch (_err) {
    return false
  }
}

/**
 * 转换得到时间差
 * @param timespan 当前时间 或 距离的值
 * @param unit     转换成指定单位
 * @returns 时差字符串
 */
export const formatJetlag = (
  timespan: number,
  unit?: '年' | '月' | '周' | '天' | '小时' | '分钟' | '秒'
) => {
  const timestamp = new Date(timespan).getTime()
  const minute = 1000 * 60
  const hour = minute * 60
  const day = hour * 24
  const month = day * 30
  const year = day * 365
  const now = new Date().getTime()
  const diffValue = timespan < year ? timespan : Math.abs(now - timestamp)
  const yearC = diffValue / year
  const monthC = diffValue / month
  const weekC = diffValue / (7 * day)
  const dayC = diffValue / day
  const hourC = diffValue / hour
  const minC = diffValue / minute
  let result

  // 指定单位转换
  if (unit) {
    const diifIndex = ['年', '月', '周', '天', '小时', '分钟', '秒'].indexOf(unit)
    if (diifIndex !== -1) {
      return [yearC, monthC, weekC, dayC, hourC, minC, diffValue][diifIndex] + unit
    }
  }

  if (yearC >= 1) {
    result = `${Math.ceil(yearC)}年`
  } else if (monthC >= 1) {
    result = `${Math.ceil(monthC)}月`
  } else if (weekC >= 1) {
    result = `${Math.ceil(weekC)}周`
  } else if (dayC >= 1) {
    result = `${Math.ceil(dayC)}天`
  } else if (hourC >= 1) {
    result = `${Math.ceil(hourC)}小时`
  } else if (minC >= 1) {
    result = `${Math.ceil(minC)}分钟`
  } else {
    result = `${diffValue}秒`
  }
  return result
}

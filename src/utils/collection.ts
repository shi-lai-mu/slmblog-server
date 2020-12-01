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
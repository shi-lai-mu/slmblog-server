import { createHash } from 'crypto';



/**
 * 生成hash
 * @param data     数据
 * @param hashType HASH生成方式
 * @param digest   摘要方式
 * @param isUpper  是否转为大写
 */
export const generateHash = (data: any, hashType: 'md5' | 'sha1' | 'sha256' | 'sha512' = 'md5', digest: any = 'hex', isUpper: boolean = true): string => {
  let hash = createHash(hashType).update(data).digest(digest);
  isUpper && (hash = hash.toLocaleUpperCase());
  return hash;
}


/**
 * 屏蔽数据
 * @param data  数据内容
 * @param start 起始位置
 * @param end   结束位置
 */
export const shieldContent = (data: string, start: number, end?: number, inset: boolean = true): string => {
  end = end || data.length;
  const endCount = data.length - Math.abs(end) - start;
  return inset
    ? data.substr(0, start) + Array(endCount).fill('*').join('') + data.substr(-end)
    : Array(start).fill('*').join('') + data.substr(start, endCount) +  Array(end).fill('*').join('')
  ;
}
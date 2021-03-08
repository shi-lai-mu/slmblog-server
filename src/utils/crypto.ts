import { createHash } from 'crypto';



/**
 * 生成hash
 * @param data     数据
 * @param hashType HASH生成方式
 * @param digest   摘要方式
 * @param isUpper  是否转为大写
 */
export function generateHash(data: any, hashType: 'md5' | 'sha1' | 'sha256' | 'sha512' = 'md5', digest: any = 'hex', isUpper: boolean = true): string {
  let hash = createHash(hashType).update(data).digest(digest);
  isUpper && (hash = hash.toLocaleUpperCase());
  return hash;
}

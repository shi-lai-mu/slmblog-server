import { UserEntity } from './entity/user.entity'

import { generateHash } from 'src/utils/crypto'
// import { UserService } from './user.service'
import { Injectable } from '@nestjs/common'

/**
 * 用户类 逻辑层基础类
 */
@Injectable()
export class UserServiceBase {
  // constructor(private readonly UserService: UserService) {}

  /**
   * 生成用户盐
   */
  static generateIV() {
    return Date.now()
      .toString(32)
      .substr(-7)
      .split('')
      .map(v => (/[a-z]/.test(v) && Math.random() > 0.3 ? v.toLocaleUpperCase() : v))
      .join('')
  }

  /**
   * 生成用户密码hash
   * @param password 密码
   * @param account  账号
   * @param iv       盐
   */
  static encryptionPwd(
    password: UserEntity['password'],
    account: UserEntity['account'],
    iv: UserEntity['iv']
  ) {
    return generateHash(generateHash(password + iv + account, 'md5'), 'sha256')
  }

  /**
   * 获取用户 平台版本
   */
  static getSystemPlatform(systemPlatform: string) {
    return (String(systemPlatform).match(
      /(MSIE|Firefox|Presto|QQBrowser|MetaSr|UCBrowser|Chrome|Safari|Edge|Macintosh|MicroMessenger|Baiduspider|PostmanRuntime)(\/[\d\.]+)?/i
    ) || [''])[0]
  }
}

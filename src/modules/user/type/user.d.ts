import { UserEntity } from "src/modules/user/entity/user.entity";



/**
 * 用户逻辑层接口
 */
export namespace UserServiceNS {
  /**
   * 注册用户 Options
   */
  export interface CreateOptions {
    /**
     * IP
     */
    ip: UserEntity['ip'];
    /**
     * 操作平台
     */
    systemPlatform: UserEntity['systemPlatform'];
  }

  /**
   * 创建用户接口
   */
  export interface CreateUser extends CreateOptions {
    /**
     * 账号
     */
    account: UserEntity['account'];
    /**
     * 昵称
     */
    nickname: UserEntity['nickname'];
    /**
     * 邮箱
     */
    email: UserEntity['email'];
    /**
     * 密码
     */
    password: UserEntity['password'];
    /**
     * 盐值
     */
    iv: UserEntity['iv'];
  }
}

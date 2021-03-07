import { User } from "src/modules/user/entity/user.entity";

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
    ip: User['ip'];
    /**
     * 操作平台
     */
    systemPlatform: User['systemPlatform'];
  }

  /**
   * 创建用户接口
   */
  export interface CreateUser extends CreateOptions {
    /**
     * 账号
     */
    account: User['account'];
    /**
     * 昵称
     */
    nickname: User['nickname'];
    /**
     * 密码
     */
    password: User['password'];
    /**
     * 盐值
     */
    iv: User['iv'];
  }
}

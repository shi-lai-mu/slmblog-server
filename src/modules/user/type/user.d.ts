import { User } from "src/entity/user.entity";

/**
 * 用户逻辑层接口
 */
export namespace UserServiceNS {
  /**
   * 注册用户 Options
   */
  export interface CreateOptions {
    ip: User['ip'];
    systemPlatform: User['systemPlatform'];
  }

  /**
   * 创建用户接口
   */
  export interface CreateUser extends CreateOptions {
    account: User['account'];
    nickname: User['nickname'];
    password: User['password'];
    iv: User['iv'];
  }
}

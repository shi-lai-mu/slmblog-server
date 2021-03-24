import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, IStrategyOptions } from "passport-local";

import { UserEntity } from "src/modules/user/entity/user.entity";

import { UserServiceBase } from "src/modules/user/user.utils";

import { ResponseBody } from "src/constants/response";
import { UserAccountResponse } from "src/modules/user/modules/account/constants/account.response";



@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) {
    super({
      usernameField: 'account',
      passwordField: 'password',
    } as IStrategyOptions);
  }

  /**
   * 本地策略校验密码
   */
  async validate(account: string, password: string) {
    const findUser = await this.userRepository.findOne({ account }, { select: ['id', 'iv', 'password', 'status'] });
    const encryptionPwd = UserServiceBase.encryptionPwd(password, findUser ? findUser.iv : '', account);

    // 账号密码校验
    if (!findUser || encryptionPwd !== findUser.password) { 
      ResponseBody.throw(UserAccountResponse.LOG_AC_PW_ERROR);
    }

    findUser.validateType = 'local';
    return findUser;
  }
}
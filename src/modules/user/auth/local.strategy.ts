import { Strategy, IStrategyOptions } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { User } from "src/entity/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserServiceBase } from "src/modules/user/user.service";
import { ResBaseException } from "src/core/exception/res.exception";
import { ResponseBody } from "src/constants/response";
import { Injectable } from "@nestjs/common";


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
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
    const findUser = await this.userRepository.findOne({ account });
    const encryptionPwd = UserServiceBase.encryptionPwd(password, findUser ? findUser.iv : '', account);

    // 账号密码校验
    if (!findUser || encryptionPwd !== findUser.password) { 
      throw new ResBaseException(ResponseBody.USER.LOG_AC_PW_ERROR);
    }
    
    return findUser;
  }
}
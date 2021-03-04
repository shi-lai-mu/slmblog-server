import { Injectable } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { ResponseEnum } from "src/constants/response";
import { ResBaseException } from "src/core/exception/res.exception";
import { User } from "src/modules/user/entity/user.entity";
import { UserStatus } from "../constants/entity.cfg";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
  ) {}

  
  /**
   * 签证Token
   * @param user 用户信息
   */
  signToken(user: User) {
    // 此处为所有用户可获得身份信息的总入口
    if (user.status !== UserStatus.Actived) {
      throw new ResBaseException(ResponseEnum.USER.ACOOUNT_ABNORMAL);
    }

    return this.jwtService.sign({
      iv: user.iv, // 校验用户盐
      id: user.id, // 用户ID
    });
  }
}
import { Injectable } from "@nestjs/common";
import { JwtModule, JwtService } from '@nestjs/jwt';
import { User } from "src/entity/user.entity";

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
    return this.jwtService.sign({
      iv: user.iv, // 校验用户盐
      id: user.id, // 用户ID
    });
  }
}
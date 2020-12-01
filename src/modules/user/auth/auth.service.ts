import { Injectable } from "@nestjs/common";
import { JwtModule, JwtService } from '@nestjs/jwt';
import { User } from "src/entity/user.entity";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
  ) {}

  
  signToken(user: User) {
    return this.jwtService.sign({
      iv: user.iv,
    });
  }
}
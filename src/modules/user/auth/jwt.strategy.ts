import { Strategy, StrategyOptions, ExtractJwt } from "passport-jwt";
import { AuthGuard, PassportStrategy } from "@nestjs/passport";
import { User } from "src/entity/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import ConfigsService from "src/configs/configs.service";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: new ConfigsService().jwt.secret,
    } as StrategyOptions);
  }

  /**
   * 本地策略校验密码
   */
  async validate(...params) {
    console.log(params);
    return true;
  }
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
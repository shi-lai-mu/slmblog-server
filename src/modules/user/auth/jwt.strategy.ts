import { Strategy, StrategyOptions, ExtractJwt } from "passport-jwt";
import { AuthGuard, PassportStrategy } from "@nestjs/passport";
import { User } from "src/entity/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import ConfigsService from "src/configs/configs.service";
import { ResponseEnum } from "src/constants/response";
import { ResBaseException } from "src/core/exception/res.exception";
import { UserService } from "../user.service";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    // @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly UserService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: new ConfigsService().jwt.secret,
    } as StrategyOptions);
  }

  /**
   * 本地策略校验身份
   * 采用 用户id 和 用户盐 取数据 (只有id和八位盐都猜出才有可能获取到)
   */
  async validate(tokenParams) {
    const user = await this.UserService.find({ id: tokenParams.id, iv: tokenParams.iv });
    user.validateType = 'jwt';
    return user;
  }
}



@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }


  /**
   * 处理请求
   */
  handleRequest(err, user, info) {
    if (err || !user) {
      let errMsg = ResponseEnum.UNAUTHORIZED_INVALID;

      if (info && info.toString().indexOf('expired') !== -1) {
        errMsg = ResponseEnum.UNAUTHORIZED_EXPIRED;
      }

      throw err || new ResBaseException(errMsg);
    }
    return user;
  }
}
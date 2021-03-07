import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard, PassportStrategy } from "@nestjs/passport";
import { Strategy, StrategyOptions, ExtractJwt } from "passport-jwt";

import { ResponseEnum } from "src/constants/response";
import { User } from "src/modules/user/entity/user.entity";
import { UserRole } from "src/modules/user/constants/entity.cfg";
import { ResBaseException } from "src/core/exception/res.exception";

import ConfigsService from "src/configs/configs.service";

const jwtConfig = new ConfigsService().jwt;
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    // private readonly UserService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // context => {
      //   let token: string = ExtractJwt.fromAuthHeaderAsBearerToken()(context);
      //   // 中间件如果设置了Authorization在headers则jwt取这里
      //   if (!token && context.headers.Authorization) {
      //     token = (context.headers.Authorization as string).split(' ')[1];
      //   }
      //   return token;
      // },
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secret,
    } as StrategyOptions);
  }


  /**
   * 本地策略校验身份
   * 采用 用户id 和 用户盐 取数据 (只有id和八位盐都猜出才有可能获取到)
   */
  async validate(data: { iv: string; id: number; iat: number; exp: number; }) {
    const user = await this.userRepository
      .createQueryBuilder('u')
      .addSelect('u.password')
      .addSelect('u.iv')
      .addSelect('u.status')
      .where({
        id: data.id,
      })
      .getOne()
    ;
    if (user) user.validateType = 'jwt';
    return user;
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



@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    return super.canActivate(context);
  }
}


/**
 * 权限守卫
 */
@Injectable()
export class JwtPermissionStrategy extends AuthGuard('jwt') {
  // 权限等级
  private PermissionRole: UserRole = UserRole.Normal;

  /**
   * 权限守卫 只允许指定权限以上用户访问接口
   * @params role 权限组
   */
  constructor(role: UserRole = UserRole.Normal) {
    super(role);
    this.PermissionRole = role;
  }

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    return super.canActivate(context);
  }

  /**
   * 处理请求
   */
  handleRequest(err, user, info) {
    const { PermissionRole } = this;

    if (err || !user) {
      let errMsg = ResponseEnum.UNAUTHORIZED_INVALID;
      if (info && info.toString().indexOf('expired') !== -1) {
        errMsg = ResponseEnum.UNAUTHORIZED_EXPIRED;
      }
      throw err || new ResBaseException(errMsg);
    }

    // 权限判断
    if (PermissionRole !== UserRole.Normal) {
      if (user.role < PermissionRole) {
        let currentRoleName = '';
        let userRoleName = '';
        for (const roleName in UserRole) {
          const item = UserRole[roleName] as unknown as UserRole;
          if (item === PermissionRole) currentRoleName = roleName;
          if (item === user.role) userRoleName = roleName;
        }
        const Error = ResponseEnum.NOT_PERMISSION;
        throw new ResBaseException({
          ...Error,
          message: Error.message.replace('%s', currentRoleName),
          result: `当前权限组 [${userRoleName}]`
        });
      }
    }
    return user;
  }
}
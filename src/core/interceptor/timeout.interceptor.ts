import { JwtService } from "@nestjs/jwt";
import { throwError, TimeoutError } from "rxjs";
import { catchError, map, timeout } from 'rxjs/operators';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";

import { User } from "src/modules/user/entity/user.entity";
import { ResBaseException } from "../exception/res.exception";
import { RedisService } from "src/modules/redis/redis.service";
import { UserServiceBase } from "src/modules/user/service/user.service";
import { AuthService } from "src/modules/user/service/auth.service";
import { ResponseBody, ResponseEnum } from "src/constants/response";

import ConfigsService from "src/configs/configs.service";
import { isDev } from "src/constants/system";


@Injectable()
export class TimeoutInterceptor implements NestInterceptor {

  private AuthService!: AuthService;

  constructor(
    private readonly configService: ConfigsService,
    private readonly redisService: RedisService,
  ) {
    this.AuthService = new AuthService(new JwtService(this.configService.jwt));
  }


  async intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const user: User | undefined = req.user;

    // 已登录用户带上新token
    if (user) {
      const token = this.AuthService.signToken(user);
      res.header('token', token);
      res.cookie('token', token, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: false,
      });

      // 跨平台/跨端 拦截
      // TODO: 不存在版本升级问题, 已移除所有数字
      // const systemPlatform = UserServiceBase.getSystemPlatform(req.headers['user-agent']);
      // const userSystemPlatform = UserServiceBase.getSystemPlatform(user.systemPlatform);
      
      // if (
      //   user.validateType === 'jwt'
      //   && systemPlatform
      //   && userSystemPlatform.replace(/\d/g, '') !== systemPlatform.replace(/\d/g, '')
      // ) {
      //   if (await this.redisService.getItem('user', `user-agent${user.id}`) === systemPlatform) {
      //     throw new ResBaseException({
      //       ...ResponseEnum.USER.UNLOG_BUSY_LINE,
      //       result: '已在其他设备上登录',
      //     });
      //   }
      //   // 异常操作
      //   throw new ResBaseException(ResponseEnum.USER.UNLOG_BUSY_LINE);
      // }

      delete user.validateType;
    }

    return next.handle()
      // 对没有带标准输出格式的响应包装
      .pipe(map(data => {
        if (data && (data.code === undefined || data.success === undefined)) {
          if (data.token) {
            res.header('token', data.token);
            delete data.token;
          }
          data = ResponseBody.send(data);
        }
        return data;
      }))
      // 5s超时拦截
      .pipe(
        timeout(5000),
        catchError(err => {
          if (err instanceof TimeoutError) {
            throw new ResBaseException(ResponseEnum.TIME_OUT_LONG);
          }
          return throwError(err);
        })
      )
      .pipe(
        catchError(err => {
          if (err instanceof ResBaseException) {
            return throwError(err);
          }
          if (isDev) {
            console.error(err);
          }
          // TODO: write log file code...
          throw new ResBaseException(ResponseEnum.SERVER_ERROR);
        })
      )
    ;
  }


  /**
   * 格式化输出token
   */
  static InputTokenFormat(token: string) {
    return 'Bearer' + token;
  }
}
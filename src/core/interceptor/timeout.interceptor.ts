import { JwtService } from "@nestjs/jwt";
import { throwError, TimeoutError } from "rxjs";
import { catchError, map, timeout } from 'rxjs/operators';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { ResponseBody, ResponseEnum } from "src/constants/response";
import { AuthService } from "src/modules/user/auth/auth.service";
import { ResBaseException } from "../exception/res.exception";
import ConfigsService from "src/configs/configs.service";
import { User } from "src/entity/user.entity";
import { RedisService } from "src/modules/redis/redis.service";


@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(
    private readonly configService: ConfigsService,
    private readonly redisService: RedisService,
  ) {}


  async intercept(context: ExecutionContext, next: CallHandler) {
    const jwt = new AuthService(new JwtService(this.configService.jwt));
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const user: User | undefined = req.user;

    // 已登录用户带上新token
    if (user) {
      res.header('token', jwt.signToken(user));

      // 跨平台/跨端 拦截
      // TODO: 不存在版本升级问题, 已移除所有数字
      const systemPlatform = String(req.headers['user-agent']).replace(/\d/g, '');
      if (
        user.validateType === 'jwt'
        && systemPlatform
        && user.systemPlatform.replace(/\d/g, '') !== systemPlatform
      ) {
        if (await this.redisService.getItem('user', `user-agent${user.id}`) === systemPlatform) {
          throw new ResBaseException({
            ...ResponseEnum.USER.UNLOG_BUSY_LINE,
            result: '已在其他设备上登录',
          });
        }
        // 异常操作
        throw new ResBaseException(ResponseEnum.USER.UNLOG_BUSY_LINE);
      }

      delete user.validateType;
    }

    // CORS
    // res.header('Access-Control-Allow-Methods', 'OPTIONS,HEAD,PUT,POST,GET,DELETE');

    return next.handle()
      // 对没有带标准输出格式的响应包装
      .pipe(map(data => {
        if (data && (data.code === undefined || data.success === undefined)) {
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
    ;
  }


  /**
   * 格式化输出token
   */
  static InputTokenFormat(token: string) {
    return 'Bearer' + token;
  }
}
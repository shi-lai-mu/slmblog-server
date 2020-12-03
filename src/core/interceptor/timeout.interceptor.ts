import { JwtService } from "@nestjs/jwt";
import { throwError, TimeoutError } from "rxjs";
import { catchError, map, timeout } from 'rxjs/operators';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { ResponseBody, ResponseEnum } from "src/constants/response";
import { AuthService } from "src/modules/user/auth/auth.service";
import { ResBaseException } from "../exception/res.exception";
import ConfigsService from "src/configs/configs.service";
import { getClientIP } from "src/utils/collection";
import { User } from "src/entity/user.entity";


@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(
    private readonly configService: ConfigsService,
  ) {}


  intercept(context: ExecutionContext, next: CallHandler) {
    const jwt = new AuthService(new JwtService(this.configService.jwt));
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const user: User | undefined = req.user;

    // 已登录用户带上新token
    if (user) {
      res.header('token', jwt.signToken(user));

      // 跨平台/跨端 拦截
      // TODO: 不存在版本升级问题, 已移除所有数字
      if (req.headers['user-agent'].replace(/\d/g, '') !== user.systemPlatform.replace(/\d/g, '') || getClientIP(req) !== user.ip) {
        throw new ResBaseException({
          ...ResponseEnum.UNAUTHORIZED_INVALID,
          result: '请勿进行 跨端/跨平台 操作'
        })
      }
    }

    // CORS
    res.header('Access-Control-Allow-Methods', 'OPTIONS,HEAD,PUT,POST,GET,DELETE');

    return next.handle()
      // 对没有带标准输出格式的响应包装
      .pipe(map(data => {
        if (data.code === undefined || data.success === undefined) {
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
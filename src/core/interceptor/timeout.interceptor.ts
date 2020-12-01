import { JwtService } from "@nestjs/jwt";
import { throwError, TimeoutError } from "rxjs";
import { catchError, map, timeout } from 'rxjs/operators';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { ResponseBody, ResponseEnum } from "src/constants/response";
import { AuthService } from "src/modules/user/auth/auth.service";
import { ResBaseException } from "../exception/res.exception";
import ConfigsService from "src/configs/configs.service";


@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(
    private readonly configService: ConfigsService,
  ) {}


  intercept(context: ExecutionContext, next: CallHandler) {
    const jwt = new AuthService(new JwtService(this.configService.jwt));

    const req = context.switchToHttp().getRequest();
    const { user } = req;
    // CORS
    req.header('Access-Control-Allow-Methods', 'OPTIONS,HEAD,PUT,POST,GET,DELETE');
    // 已登录用户带上新token
    if (user) req.header('token', TimeoutInterceptor.InputTokenFormat(jwt.signToken(user)));

    return next.handle()
      // 对没有带标准输出格式的响应包装
      .pipe(map(data => {
        if (data.token) {
          req.header('token', TimeoutInterceptor.InputTokenFormat(data.token));
          delete data.token;
        };
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
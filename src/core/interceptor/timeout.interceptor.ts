import { Response } from 'express'
import { throwError, TimeoutError } from 'rxjs'
import { catchError, map, timeout } from 'rxjs/operators'
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'

import { UserEntity } from 'src/modules/user/entity/user.entity'

import { UserAuthService } from 'src/modules/user/modules/auth/service/auth.service'
import { RedisService } from 'src/modules/coreModules/redis/redis.service'
import ConfigsService from 'src/modules/coreModules/config/configs.service'

import { isDev } from 'src/constants/system'
import { ResBaseException } from '../exception/res.exception'
import { ResponseBody, ResponseEnum } from 'src/constants/response'

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  // private AuthService!: UserAuthService;

  constructor(
    private readonly configService: ConfigsService,
    private readonly redisService: RedisService,
    private readonly AuthService: UserAuthService
  ) {
    // this.AuthService = new UserAuthService(new JwtService(this.configService.jwt));
  }

  async intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest()
    const res: Response = context.switchToHttp().getResponse()
    const user: UserEntity | undefined = req.user

    // 已登录用户带上新token
    if (user) {
      const token = await this.AuthService.signToken(user)
      res.header('token', token)
      res.cookie('token', token, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: false,
      })

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
      //     ResponseBody.throw({
      //       ...ResponseEnum.USER.UNLOG_BUSY_LINE,
      //       result: '已在其他设备上登录',
      //     });
      //   }
      //   // 异常操作
      //   ResponseBody.throw(ResponseEnum.USER.UNLOG_BUSY_LINE);
      // }
      delete user.validateType
    }

    return (
      next
        .handle()
        // 对没有带标准输出格式的响应包装
        .pipe(
          map(data => {
            if (
              data !== undefined &&
              (data.code === undefined || (data.success === undefined && !data.result))
            ) {
              if (data.token) {
                res.header('token', data.token)
                delete data.token
              }
              const contentType = res.getHeaders()['content-type']
              if (!contentType || /application\/json/.test(contentType as string)) {
                data = ResponseBody.send(data)
              }
            }
            return data
          })
        )
        // 5s超时拦截
        .pipe(
          timeout(10000),
          catchError(err => {
            if (err instanceof TimeoutError) {
              ResponseBody.throw(ResponseEnum.TIME_OUT_LONG)
            }
            return throwError(err)
          })
        )
        .pipe(
          catchError(err => {
            if (err instanceof ResBaseException) {
              if (err.transferLog) {
                err.transferLog(req)
              }
              return throwError(err)
            }
            if (isDev) {
              console.error(err)
            }
            if (!err?.code) {
              // TODO: write log file code...
              ResponseBody.throw(ResponseEnum.SERVER_ERROR)
            }
            console.log('[错误位置]: ', err)
            return throwError(new ResBaseException(err))
          })
        )
    )
  }

  /**
   * 格式化输出token
   */
  static InputTokenFormat(token: string) {
    return 'Bearer' + token
  }
}

import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'

import { ResponseBody, ResponseEnum } from 'src/constants/response'
import { Logger } from 'src/plugins/log4'

/**
 * 全局过滤器
 */
@Catch(HttpException)
export class GlobalFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response: any = ctx.getResponse<Response>()
    const request = ctx.getRequest()
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

    const errorShooting = {
      401: ResponseEnum.UNAUTHORIZED,
      404: ResponseEnum.NOT_FOUND,
      500: ResponseEnum.SERVER_ERROR,
      429: ResponseEnum.FREQUENTLY,
    }

    // 自定义异常格式体
    const logFormat = `Request original url: ${request.originalUrl}
    Method: ${request.method}
    IP: ${request.ip}
    Status code: ${status}
    Response: ${exception}`

    // Logger.error(logFormat)

    // 发送响应
    response
      .status(errorShooting[status] ? 200 : status)
      .json(
        errorShooting[status] ? ResponseBody.send(errorShooting[status]) : exception.getResponse()
      )
  }
}

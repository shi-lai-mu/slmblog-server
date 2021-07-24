import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response } from 'express'
import { Logger } from 'src/plugins/log4'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: CallableFunction) {
    const code = res.statusCode
    next()
    const logFormat = JSON.stringify({
      IP: req.ip,
      req_url: req.originalUrl,
      req_method: req.method,
      status_code: code,
      parmas: req.params,
      query: req.query,
      body: req.body,
    })

    // 根据状态码，进行日志类型区分
    if (code >= 500) {
      Logger.error(logFormat)
    } else if (code >= 400) {
      Logger.warn(logFormat)
    } else {
      Logger.access(logFormat)
      Logger.log(logFormat)
    }
  }
}

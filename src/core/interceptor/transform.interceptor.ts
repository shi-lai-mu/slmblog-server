import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Logger } from 'src/plugins/log4'

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.getArgByIndex(1).req

    return next.handle().pipe(
      map(data => {
        const logFormat = JSON.stringify({
          IP: req.ip,
          user: `${req.user}`,
          res_url: req.originalUrl,
          res_method: req.method,
          res_data: data,
        })
        Logger.info(logFormat)
        Logger.access(logFormat)
        return data
      })
    )
  }
}

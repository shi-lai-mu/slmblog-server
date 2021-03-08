import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";

import { ResponseBody, ResponseEnum } from "src/constants/response";



/**
 * 全局过滤器
 */
@Catch(HttpException)
export class GlobalFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: any = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status = exception.getStatus();
    
    const errorShooting = {
      401: ResponseEnum.UNAUTHORIZED,
      404: ResponseEnum.NOT_FOUND,
      500: ResponseEnum.SERVER_ERROR,
    };

    if (request.method === 'OPTIONS') {
      status = 200;
    }

    // 发送响应
    response
      .status(errorShooting[status] ? 200 : status)
      .json(errorShooting[status]
        ? ResponseBody.send(errorShooting[status])
        : exception.getResponse()
      )
    ;
    if (request.method !== 'OPTIONS') {
      console.log('[%s] %s %s error: %s', status, request.method, request.url, exception.message);
    }
  }
}
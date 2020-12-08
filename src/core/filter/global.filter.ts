import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { ResponseBody, ResponseEnum } from "src/constants/response";

@Catch(HttpException)
export class GlobalFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: any = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    
    console.log('[%s] %s %s error: %s', status, request.method, request.url, exception.message);

    const errorShooting = {
      404: ResponseEnum.NOT_FOUND,
      500: ResponseEnum.SERVER_ERROR,
    };
    // console.log(exception.getResponse());
    

    // 发送响应
    response
      .status(status)
      .json(errorShooting[status]
        ? ResponseBody.send(errorShooting[status])
        : exception.getResponse()
      );
  }
}
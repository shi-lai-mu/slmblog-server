import { HttpException, HttpStatus } from "@nestjs/common";

import { generateUUID } from '../../utils/collection';
import { ErrorStatus, Status } from '../../constants/response';



/**
 * 请求基础 异常类
 */
export class ResBaseException extends HttpException {
  constructor(exception: Status | ErrorStatus) {
    // const errorResponse: ErrorStatus = exception;

    if (exception.code === undefined) {
      exception.code = 503;
    }

    // 错误响应附带内容
    if (exception.code !== 0) {
      (<ErrorStatus>exception).uuid = generateUUID();
      (<ErrorStatus>exception).time = new Date().toLocaleString();
      (<ErrorStatus>exception).result = exception.result || '';
    }

    super(exception, HttpStatus.OK);
  }
}
import { Request } from "@nestjs/common";
import { User } from "src/entity/user.entity";

export interface GlobalRequest extends Request {
  user: User;
}

/**
 * 常量 请求响应 接口
 * @file src/constants/response
 */
export namespace ConstantsResponse {
  /**
   * 响应状态
   */
  export interface Status {
    /**
     * 响应码
     */
    code: number;
    /**
     * 响应内容
     */
    message: string;
    /**
     * 执行状态
     */
    success?: boolean;
    /**
     * 执行结果
     */
    result?: any;
  }


  /**
   * 错误响应体
   */
  export interface ErrorStatus extends Status {
    /**
     * 追踪UUID
     */
    uuid: string;
    /**
     * 报错时间
     */
    time: string;
  }
} 
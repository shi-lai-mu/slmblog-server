import { ResponseCodeDocument } from ".";
import { ResponseDocument } from "./type";

/**
 * 注册响应文档
 */
export const RegisterResponse = (option: ResponseDocument.InsterOptions) => {
  return function (res: any) {
    option.tips = option.tips || res.name;
    ResponseCodeDocument.addResponseBusiness(res, option);
  }
}
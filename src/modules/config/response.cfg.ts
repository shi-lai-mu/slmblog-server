import { Status } from "src/constants/response";

/**
 * 配置类 响应信息
 */
export class ConfigResponse {
  // 保存信息为空
  static readonly SAVE_JSON_EMPTY:   Status = { code: 1300, message: '保存信息不能为空!' };
  // 配置保存失败
  static readonly SAVE_INSERT_ERROR: Status = { code: 1301, message: '配置保存失败，请稍后再试!' };
  // 配置保存失败
  static readonly SAVE_UPDATE_ERROR: Status = { code: 1302, message: '配置保存失败，请稍后再试!' };
}
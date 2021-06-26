import { Status } from 'src/constants/response'
import { RegisterResponse } from 'src/plugins/slm/resCodeDoc/decorators'

/**
 * 用户类 认证模块 响应信息
 */
@RegisterResponse({
  name: '用户业务',
  startCode: 1100,
  extends: '用户配置模块',
})
export class UserConfigResponse {
  /** 保存信息为空 */
  static readonly SAVE_JSON_EMPTY: Status = {
    codeType: 'P',
    message: '保存信息不能为空!',
  }

  /** 配置保存失败 */
  static readonly SAVE_INSERT_ERROR: Status = {
    codeType: 'D',
    message: '配置保存失败，请稍后再试!',
  }

  /** 配置保存失败 */
  static readonly SAVE_UPDATE_ERROR: Status = {
    codeType: 'D',
    message: '配置保存失败，请稍后再试!',
  }
}

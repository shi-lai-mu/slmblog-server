import { Status } from 'src/constants/response'
import { RegisterResponse } from 'src/plugins/slm/resCodeDoc/decorators'

/**
 * 通知业务 响应
 */
@RegisterResponse({
  name: '通知业务',
  startCode: 1400,
})
export class NotifyResponse {
  /** 链接格式不正确 */
  PARAMS_INVALID_URL: Status = {
    codeType: 'P',
    message: '请输入有效的链接!',
  }
}

import { createParamDecorator } from '@nestjs/common'

/**
 * 获取当前登录用户信息
 */
export const CurUser = createParamDecorator((_data, req) => req.user || req.args[1].req.user || {})

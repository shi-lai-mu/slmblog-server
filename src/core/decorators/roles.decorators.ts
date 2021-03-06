import { SetMetadata } from '@nestjs/common'

/**
 * 设置Metdata Roles
 * @param roles 权限
 */
export const Roles = (...roles: number[]) => SetMetadata('roles', roles)

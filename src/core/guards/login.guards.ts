import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
// import { ResBaseException } from '../exception/res.exception';
// import { Response } from '../../constants/response';

/**
 * 登录态守卫
 */
@Injectable()
export class LoginGuards implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
        // throw new ResBaseException(Response.status('PARAMS'));
    }

    return true;
  }
}
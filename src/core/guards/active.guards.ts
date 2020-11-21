import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class ActiveGuards implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    console.log(JSON.stringify({
        codeline: 'active.guard canActivate',
        ip: request.clientIp,
        timeLabel: new Date().toLocaleDateString(),
    }));
    console.log(request.clientIp);
    

    return true;
  }
}
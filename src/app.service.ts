import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '访问检测成功!后端正常运行中...';
  }
}

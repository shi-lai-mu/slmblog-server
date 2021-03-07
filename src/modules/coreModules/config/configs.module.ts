import { Global, Module } from '@nestjs/common';
import ConfigsService from './configs.service';

/**
 * 核心 配置业务 模块
 */
@Global()
@Module({
  providers: [ ConfigsService ],
  exports: [ ConfigsService ]
})
export class ConfigsModule {}
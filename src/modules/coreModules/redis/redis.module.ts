import { DynamicModule, Global, Module } from "@nestjs/common";
import ConfigsService from "src/modules/coreModules/config/configs.service";
import { RedisService } from "./redis.service";

/**
 * 核心 Redis 模块
 */
@Global()
@Module({})
export class RedisModule {
  static forRootAsync(options): DynamicModule {
    const providers = [
      {
        provide: 'RedisModuleOptions',
        useFactory: options.useFactory,
        inject: options.inject,
      },
      {
        provide: RedisModule,
        useFactory: (configsService: ConfigsService) => new RedisService(configsService),
        inject: ['RedisModuleOptions'],
      },
    ];
    return {
      module: RedisModule,
      providers,
      exports: providers,
    }
  }
}
import { TypeOrmModule } from '@nestjs/typeorm';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { RedisService } from './modules/coreModules/redis/redis.service';
import ConfigService from './modules/coreModules/config/configs.service';

import { NotifyModule } from './modules/notify/index.module';
import { UserBusinessModule } from './modules/user/index.module';
import { RedisModule } from './modules/coreModules/redis/redis.module';
import { ArticleBusinessModule } from './modules/article/index.module';
import { ConfigsModule } from './modules/coreModules/config/configs.module';
import { ScheduleBusinessModule } from './modules/coreModules/schedule/schedule.module';

import { GlobalMiddleware } from './core/middleware/global.middleware';



/**
 * APP 主模块
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => configService.db,
      inject: [ ConfigService ],
    }),
    RedisModule.forRootAsync({
      useFactory: async (configService: ConfigService) => configService,
      inject: [ ConfigService ],
    }),
    NotifyModule,
    ConfigsModule,
    UserBusinessModule,
    ArticleBusinessModule,
    ScheduleBusinessModule,
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService,
    RedisService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        // 全局中间件
        GlobalMiddleware,
      )
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL
      })
    ;
  }
}

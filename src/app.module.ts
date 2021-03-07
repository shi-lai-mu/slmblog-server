import { TypeOrmModule } from '@nestjs/typeorm';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { UserModule } from './modules/user/user.module';
import { ConfigsModule } from './modules/coreModules/config/configs.module';
import { NoticModule } from './modules/notify/notic/notic.module';
import { RedisModule } from './modules/coreModules/redis/redis.module';
import { ArticleBusinessModule } from './modules/article/index.module';
import { GlobalMiddleware } from './core/middleware/global.middleware';
import { RedisService } from './modules/coreModules/redis/redis.service';
import { ScheduleBusinessModule } from './modules/coreModules/schedule/schedule.module';

import ConfigService from './modules/coreModules/config/configs.service';


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
    UserModule,
    NoticModule,
    ConfigsModule,
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

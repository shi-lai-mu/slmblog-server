import { APP_GUARD } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'

import { AppService } from './app.service'
import { AppController } from './app.controller'
import { RedisService } from './modules/coreModules/redis/redis.service'
import ConfigService from './modules/coreModules/config/configs.service'

import { NotifyBusinessModule } from './modules/notify/index.module'
import { UserBusinessModule } from './modules/user/index.module'
import { RedisModule } from './modules/coreModules/redis/redis.module'
import { ArticleBusinessModule } from './modules/article/index.module'
import { ResourcesBusinessModule } from './modules/resources/index.module'
import { ConfigsModule } from './modules/coreModules/config/configs.module'
import { ScheduleBusinessModule } from './modules/coreModules/schedule/schedule.module'

import { GlobalMiddleware } from './core/middleware/global.middleware'

/**
 * APP 主模块
 */
@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => configService.db,
      inject: [ConfigService],
    }),
    RedisModule.forRootAsync({
      useFactory: async (configService: ConfigService) => configService,
      inject: [ConfigService],
    }),
    ConfigsModule,
    UserBusinessModule,
    NotifyBusinessModule,
    ArticleBusinessModule,
    ScheduleBusinessModule,
    ResourcesBusinessModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    RedisService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        // 全局中间件
        GlobalMiddleware
      )
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      })
  }
}

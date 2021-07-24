import { APP_GUARD } from '@nestjs/core'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'

import { AppService } from './app.service'
import { AppController } from './app.controller'
import { RedisService } from './modules/coreModules/redis/redis.service'

import { UserBusinessModule } from './modules/user/index.module'
import { NotifyBusinessModule } from './modules/notify/index.module'
import { RedisModule } from './modules/coreModules/redis/redis.module'
import { ArticleBusinessModule } from './modules/article/index.module'
import { ResourcesBusinessModule } from './modules/resources/index.module'
import { ScheduleBusinessModule } from './modules/coreModules/schedule/schedule.module'

import { DBConfig } from './configs/type/db.cfg'
import { configModuleOptions } from 'config/ConfigModuleOptions'
import { GlobalMiddleware } from './core/middleware/global.middleware'
import { LoggerMiddleware } from './core/middleware/logger.middleware'

/**
 * APP 主模块
 */
@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    // 频繁请求限制
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 5,
    }),
    TypeOrmModule.forRoot(new DBConfig()),
    RedisModule,
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
        LoggerMiddleware,
        GlobalMiddleware
      )
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      })
  }
}

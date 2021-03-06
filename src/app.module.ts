import { TypeOrmModule } from '@nestjs/typeorm';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { UserModule } from './modules/user/user.module';
import { ConfigsModule } from './configs/configs.module';
import { RedisModule } from './modules/coreModules/redis/redis.module';
import { ArticleBusinessModule } from './modules/article/index.module';
import { NoticModule } from './modules/notify/notic/notic.module';
import { GlobalMiddleware } from './core/middleware/global.middleware';

import ConfigService from './configs/configs.service';
import { ScheduleBusinessModule } from './modules/coreModules/schedule/schedule.module';
import { RedisService } from './modules/coreModules/redis/redis.service';


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
    ConfigsModule,
    UserModule,
    ScheduleBusinessModule,
    ArticleBusinessModule,
    NoticModule,
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
        GlobalMiddleware,
      )
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL
      })
    ;
  }
}

import { TypeOrmModule } from '@nestjs/typeorm';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { UserModule } from './modules/user/user.module';
import { ConfigsModule } from './configs/configs.module';
import { RedisModule } from './modules/redis/redis.module';
import { ConfigAllModule } from './modules/config/config.module';
import { ArticleModule } from './modules/article/article.module';
import { NoticModule } from './modules/notify/notic/notic.module';
import { GlobalMiddleware } from './core/middleware/global.middleware';

import ConfigService from './configs/configs.service';


@Module({
  imports: [
    ConfigsModule,
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => configService.db,
      inject: [ ConfigService ],
    }),
    RedisModule.forRootAsync({
      useFactory: async (configService: ConfigService) => configService,
      inject: [ ConfigService ],
    }),
    UserModule,
    ArticleModule,
    NoticModule,
    ConfigAllModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        GlobalMiddleware,
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}

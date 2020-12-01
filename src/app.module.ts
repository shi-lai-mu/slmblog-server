import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from './modules/redis/redis.module';
import { ConfigsModule } from './configs/configs.module';
import ConfigService from './configs/configs.service';
import { GlobalMiddleware } from './core/middleware/global.middleware';


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

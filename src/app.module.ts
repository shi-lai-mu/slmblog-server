import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from './modules/redis/redis.module';
import { ConfigsModule } from './configs/configs.module';
import ConfigService from './configs/configs.service';


@Module({
  imports: [
    ConfigsModule,
    UserModule,
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => configService.db,
      inject: [ ConfigService ],
    }),
    RedisModule.forRootAsync({
      useFactory: async (configService: ConfigService) => configService,
      inject: [ ConfigService ],
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply()
  }
}

import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigsModule } from './configs/configs.module';
import ConfigService from './configs/configs.service';

function test(target, name, descriptor) {
  console.log(target, name, descriptor);
  console.log(descriptor.value);
}

@Module({
  imports: [
    ConfigsModule,
    UserModule,
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => configService.db,
      inject: [ ConfigService ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  @test
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply()
  }
}

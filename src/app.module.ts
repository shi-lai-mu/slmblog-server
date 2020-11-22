import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';

function test(target, name, descriptor) {
  console.log(target, name, descriptor);
  console.log(descriptor.value);
}

@Module({
  imports: [UserModule],
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

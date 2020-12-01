import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import ConfigsService from './configs/configs.service';
import { TimeoutInterceptor } from './core/interceptor/timeout.interceptor';
import createApiDocument from './plugins/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new TimeoutInterceptor(app.get(ConfigsService)));

  createApiDocument(app);

  await app.listen(3000);
}
bootstrap();

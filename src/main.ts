import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import createApiDocument from './plugins/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  createApiDocument(app);

  await app.listen(3000);
}
bootstrap();

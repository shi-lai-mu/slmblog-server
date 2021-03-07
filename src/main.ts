import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TimeoutInterceptor } from './core/interceptor/timeout.interceptor';
import { GlobalFilter } from './core/filter/global.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import createApiDocument from './plugins/swagger';
import ConfigsService from './modules/coreModules/config/configs.service';
import { RedisService } from './modules/coreModules/redis/redis.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: true,
  });
  const configsService = app.get(ConfigsService);
  const redisService = app.get(RedisService);

  app.useGlobalInterceptors(new TimeoutInterceptor(configsService, redisService));
  app.useGlobalFilters(new GlobalFilter());
  app.useStaticAssets('public');

  createApiDocument(app);

  await app.listen(3000, '0.0.0.0');
}
bootstrap();

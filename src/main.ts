import { NestFactory } from '@nestjs/core';
import { GlobalFilter } from './core/filter/global.filter';
import { TimeoutInterceptor } from './core/interceptor/timeout.interceptor';

import { NestExpressApplication } from '@nestjs/platform-express';
import { RedisService } from './modules/coreModules/redis/redis.service';
import ConfigsService from './modules/coreModules/config/configs.service';

import { AppModule } from './app.module';

import createApiDocument from './plugins/swagger';
import { UserAuthService } from './modules/user/service/auth.service';



async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: true,
  });
  const configsService = app.get(ConfigsService);
  const redisService = app.get(RedisService);
  const userAuthService = app.get(UserAuthService);

  app.useGlobalInterceptors(new TimeoutInterceptor(configsService, redisService, userAuthService));
  app.useGlobalFilters(new GlobalFilter());
  app.useStaticAssets('public');

  createApiDocument(app);

  await app.listen(3000, '0.0.0.0');
}
bootstrap();

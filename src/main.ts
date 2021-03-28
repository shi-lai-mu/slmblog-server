import { NestFactory } from '@nestjs/core';
import { GlobalFilter } from './core/filter/global.filter';
import { TimeoutInterceptor } from './core/interceptor/timeout.interceptor';

import { NestExpressApplication } from '@nestjs/platform-express';
import { RedisService } from './modules/coreModules/redis/redis.service';
import ConfigsService from './modules/coreModules/config/configs.service';

import { AppModule } from './app.module';

import pluginsCfg from 'src/configs/plugins.cfg';
import { APIPrefix } from 'src/constants';
import createApiDocument from './plugins/swagger';
import { UserAuthService } from './modules/user/modules/auth/service/auth.service';
import { createResponseDocument } from 'src/plugins/slm/resCodeDoc';



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
  app.setGlobalPrefix(APIPrefix);

  createApiDocument(app);
  createResponseDocument(app, pluginsCfg.codeDoc);

  await app.listen(3000, '0.0.0.0');
}
bootstrap();

import { NestFactory } from '@nestjs/core'
import { GlobalFilter } from './core/filter/global.filter'
import { TimeoutInterceptor } from './core/interceptor/timeout.interceptor'

import { NestExpressApplication } from '@nestjs/platform-express'
import { RedisService } from './modules/coreModules/redis/redis.service'

import { AppModule } from './app.module'

import { APIPrefix } from 'src/constants'
import terminal from './plugins/terminal'
import createApiDocument from './plugins/swagger'
import { createResponseDocument } from 'src/plugins/slm/resCodeDoc'
import { TransformInterceptor } from './core/interceptor/transform.interceptor'
import { UserAuthService } from './modules/user/modules/auth/service/auth.service'
import { Logger } from './plugins/log4'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    logger: ['error'],
  })

  app.useGlobalInterceptors(
    new TimeoutInterceptor(app.get(RedisService), app.get(UserAuthService)),
    new TransformInterceptor()
  )
  app.useGlobalFilters(new GlobalFilter())

  app.useStaticAssets('public')
  app.setGlobalPrefix(APIPrefix)

  createApiDocument(app)
  createResponseDocument(app)

  await app.listen(Number(process.env.LISTEN_PROT), process.env.LISTEN_HOSTNAME)
}
bootstrap().then(terminal)

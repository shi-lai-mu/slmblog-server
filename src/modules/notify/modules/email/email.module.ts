import * as path from 'path'
import { Logger, Module } from '@nestjs/common'
import { MailerModule } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'

import { NotifyEmailService } from './service/email.service'
import { NotifyEmailController } from './controller/email.controller'
import { RedisService } from 'src/modules/coreModules/redis/redis.service'

/**
 * 通知业务 邮箱 模块
 */
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => {
        const { env } = process
        return {
          transport: {
            host: env.EMAIL_TRANSPORT_HOST,
            port: parseInt(env.EMAIL_TRANSPORT_PORT),
            auth: {
              user: env.EMAIL_TRANSPORT_AUTH_USER,
              pass: env.EMAIL_TRANSPORT_AUTH_PASS,
            },
          },
          template: {
            dir: path.join(__dirname, 'template').replace(/src/g, ''),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        }
      },
    }),
  ],
  controllers: [NotifyEmailController],
  providers: [NotifyEmailService, RedisService, Logger],
  exports: [Logger, RedisService],
})
export class NotifyEmailModule {}

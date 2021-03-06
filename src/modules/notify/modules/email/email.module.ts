import * as path from 'path'
import { Logger, Module } from '@nestjs/common'
import { MailerModule } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'

import { NotifyEmailService } from './service/email.service'
import { NotifyEmailController } from './controller/email.controller'
import { RedisService } from 'src/modules/coreModules/redis/redis.service'
import ConfigsService from 'src/modules/coreModules/config/configs.service'

/**
 * 通知业务 邮箱 模块
 */
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (configsService: ConfigsService) => ({
        ...configsService.email,
        template: {
          dir: path.join(__dirname, './template').replace('dist', 'src'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigsService],
    }),
  ],
  controllers: [NotifyEmailController],
  providers: [NotifyEmailService, RedisService, Logger],
  exports: [Logger, RedisService],
})
export class NotifyEmailModule {}

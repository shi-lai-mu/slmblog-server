import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { JwtStrategy } from '../../core/strategy/jwt.strategy';
import { AuthService } from './service/auth.service';
import { UserService } from './service/user.service';
import { RedisService } from '../coreModules/redis/redis.service';
import { UserConfigService } from './service/config.service';
import { UserController } from './controller/user.controller';
import { UserAccountController } from './controller/account.controller';
import { User, UserConfigEntity } from 'src/modules/user/entity/user.entity';

import { Badge } from './entity/badge.entity';
import { UserConfigController } from './controller/config.controller';

import ConfigsService from 'src/configs/configs.service';
import { LocalStrategy } from 'src/core/strategy/local.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Badge, User, UserConfigEntity]),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configsService: ConfigsService) => configsService.jwt,
      inject: [ConfigsService]
    }),
  ],
  controllers: [
    UserController,
    UserAccountController,
    UserConfigController,
  ],
  providers: [
    UserService,
    UserConfigService,
    LocalStrategy,
    AuthService,
    JwtStrategy,
    RedisService,
  ],
  exports: [],
})
export class UserModule {}

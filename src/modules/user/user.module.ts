import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { UserService } from './user.service';
import { JwtStrategy } from './auth/jwt.strategy';
import { AuthService } from './auth/auth.service';
import { UserController } from './user.controller';
import { LocalStrategy } from './auth/local.strategy';
import { RedisService } from '../redis/redis.service';
import { UserAccountController } from './userAccount.controller';
import { User, UserConfigEntity } from 'src/modules/user/entity/user.entity';
import { UserConfigService } from '../config/user/userConfig.service';

import ConfigsService from 'src/configs/configs.service';
import { Badge } from './entity/badge.entity';

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
  ],
  providers: [
    UserService,
    UserConfigService,
    LocalStrategy,
    AuthService,
    JwtStrategy,
    RedisService,
  ],
  exports: [UserService],
})
export class UserModule {}

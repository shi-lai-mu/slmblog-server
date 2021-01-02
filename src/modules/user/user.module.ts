import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { UserService } from './user.service';
import { JwtStrategy } from './auth/jwt.strategy';
import { AuthService } from './auth/auth.service';
import { UserController } from './user.controller';
import { User, Badge } from 'src/entity/user.entity';
import { LocalStrategy } from './auth/local.strategy';
import { RedisService } from '../redis/redis.service';
import { UserAccountController } from './userAccount.controller';

import ConfigsService from 'src/configs/configs.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Badge]),
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
    LocalStrategy,
    AuthService,
    JwtStrategy,
    RedisService,
  ],
  exports: [UserService],
})
export class UserModule {}

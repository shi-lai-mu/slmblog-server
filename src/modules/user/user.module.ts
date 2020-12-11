import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserAccountController } from './userAccount.controller';
import { User, Badge } from 'src/entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './auth/local.strategy';
import { JwtStrategy } from './auth/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { RedisService } from '../redis/redis.service';
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
    JwtStrategy,
    RedisService,
  ],
  exports: [UserService],
})
export class UserModule {}

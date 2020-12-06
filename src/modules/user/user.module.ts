import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserAccountController } from './userAccount.controller';
import { User, Badge } from 'src/entity/user.entity';
import ConfigsService from 'src/configs/configs.service';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './auth/local.strategy';
import { JwtStrategy } from './auth/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { RedisService } from '../redis/redis.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Badge,
    ]),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configsService: ConfigsService) => configsService.jwt,
      inject: [ConfigsService]
    }),
    // AuthModule
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

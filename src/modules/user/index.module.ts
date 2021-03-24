import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Badge } from './entity/badge.entity';
import { UserEntity, UserConfigEntity } from 'src/modules/user/entity/user.entity';

import { UserAuthModule } from './modules/auth/auth.module';
import { UserAccountModule } from './modules/account/account.module';

import { UserModule } from './user.moudle';
import { UserConfigModule } from './modules/config/config.module';
import { UserController } from './user.controller';



/**
 * 用户业务 主模块
 */
@Module({
  imports: [
    UserAccountModule,
    UserModule,
    UserAuthModule,
    UserConfigModule,
    TypeOrmModule.forFeature([
      Badge,
      UserEntity,
      UserConfigEntity,
    ]),
  ],
  controllers: [
    UserController,
  ],
  providers: [
  ],
})
export class UserBusinessModule {};

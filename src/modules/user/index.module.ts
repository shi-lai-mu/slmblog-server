import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Badge } from './entity/badge.entity';
import { UserEntity, UserConfigEntity } from 'src/modules/user/entity/user.entity';

import { UserModule } from './user.moudle';
import { UserController } from './user.controller';
import { UserAuthModule } from './modules/auth/auth.module';
import { UserConfigModule } from './modules/config/config.module';
import { UserAccountModule } from './modules/account/account.module';



/**
 * 用户业务 主模块
 */
@Module({
  imports: [
    UserModule,
    UserAuthModule,
    UserConfigModule,
    UserAccountModule,
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

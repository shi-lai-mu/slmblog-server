import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Badge } from './entity/badge.entity';
import { UserEntity, UserConfigEntity } from 'src/modules/user/entity/user.entity';

import { UserModule } from './module/user.moudle';
import { UserAuthModule } from './module/auth.module';
import { UserAccountModule } from './module/account.module';

import { UserConfigModule } from './module/config.module';



/**
 * 用户业务 主模块
 */
@Module({
  imports: [
    UserAccountModule,
    UserModule,
    UserAuthModule,
    UserConfigModule,
    TypeOrmModule.forFeature([Badge, UserEntity, UserConfigEntity]),
  ],
  providers: [
  ],
})
export class UserBusinessModule {};

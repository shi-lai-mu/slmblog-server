import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Badge } from './entity/badge.entity';
import { UserEntity, UserConfigEntity } from 'src/modules/user/entity/user.entity';

import { UserModule } from './user.moudle';
import { UserController } from './user.controller';
import { UserAuthModule } from './modules/auth/auth.module';
import { UserConfigModule } from './modules/config/config.module';
import { UserAccountModule } from './modules/account/account.module';
import { RedisModule } from '../coreModules/redis/redis.module';
import { UserService } from './user.service';
import { UserConfigService } from './modules/config/service/config.service';
import { UserAuthValidateModule } from './modules/auth/validate.module';
import { UserAuthValidateService } from './modules/auth/service/validate.service';
import { UserAuthValidateController } from './modules/auth/controller/validate.controller';
import { UserAccountService } from './modules/account/service/account.service';
import { RedisService } from '../coreModules/redis/redis.service';
import { UserAuthService } from './modules/auth/service/auth.service';
import { JwtModule, JwtService } from '_@nestjs_jwt@7.2.0@@nestjs/jwt';
import ConfigsService from '../coreModules/config/configs.service';
import { UserAuthController } from './modules/auth/controller/auth.controller';



/**
 * 用户业务 主模块
 */
@Module({
  imports: [
    UserModule,
    RedisModule,
    UserAuthModule,
    UserConfigModule,
    UserAccountModule,
  ],
})
export class UserBusinessModule {};

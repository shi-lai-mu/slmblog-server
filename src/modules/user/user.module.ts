import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserAccountController } from './userAccount.controller';
import { User, Badge } from '../../entity/user.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Badge,
    ]),
  ],
  controllers: [
    UserController,
    UserAccountController
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

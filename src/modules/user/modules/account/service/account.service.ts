import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../../../entity/user.entity';

import { UserService } from 'src/modules/user/user.service';
import { UserServiceBase } from 'src/modules/user/user.base';
import { RedisService } from 'src/modules/coreModules/redis/redis.service';

import { UserServiceNS } from '../../../type/user';
import { ResponseBody } from 'src/constants/response';
import { UserRegisterDto } from '../dto/account.dto';
import { UserAccountResponse } from '../constants/account.response';
import { UserAuthValidateController } from '../../auth/controller/validate.controller';
import { UserAuthValidateService } from '../../auth/service/validate.service';
import { UserAuthService } from '../../auth/service/auth.service';



/**
 * 用户业务 逻辑层
 */
@Injectable()
export class UserAccountService {

  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    private readonly RedisService: RedisService,
    private readonly UserAuthValidateService: UserAuthValidateService,
    private readonly UserService: UserService,
  ) {}

  /**
   * 创建账号
   * @param user 账号数据
   */
  async create(data: UserRegisterDto, options: UserServiceNS.CreateOptions) {
    const { account, password, email, notSend } = data;
    const iv = UserServiceBase.generateIV();
    
    if (await this.UserService.isRegister(account)) { 
      ResponseBody.throw(UserAccountResponse.REG_AC_EXISTS);
    }
    
    if (await this.UserService.isRegister(email)) {
      ResponseBody.throw(UserAccountResponse.REG_EMAIL_EXISTS);
    }
    
    const user = await new UserEntity({
      ...options,
      nickname: String(account).substr(-4),
      account,
      email,
      password: UserServiceBase.encryptionPwd(password, iv, account),
      iv,
    })
    .save();

    // 注册成功
    if (user.id) {
      if (!notSend) {
        this.UserAuthValidateService.sendValidateAccountEmail({
          email,
          account,
        });
      }
    }

    return plainToClass(UserEntity, user);
  }


  /**
   * 登录账号
   * @param user 账号数据
   */
  async login(user: UserEntity, options: UserServiceNS.CreateOptions) {
    options.systemPlatform = UserServiceBase.getSystemPlatform(options.systemPlatform);
    this.RedisService.setItem('user', `user-agent${user.id}`, user.systemPlatform);

    // 更新账号信息
    this.userRepository.update({ id: user.id }, {
      systemPlatform: options.systemPlatform,
      ip: options.ip,
      updateTime: new Date(),
    });

    return plainToClass(UserEntity, user);
  }
}

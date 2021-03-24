import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../../../entity/user.entity';

import { UserService } from 'src/modules/user/user.service';
import { UserServiceBase } from 'src/modules/user/user.utils';
import { RedisService } from '../../../../coreModules/redis/redis.service';

import { UserServiceNS } from '../../../type/user';
import { UserLoginDto } from '../dto/account.dto';
import { ResponseBody } from 'src/constants/response';
import { UserAccountResponse } from '../constants/account.response';



/**
 * 用户业务 逻辑层
 */
@Injectable()
export class UserAccountService {

  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    private readonly RedisService: RedisService,
    private readonly UserService: UserService,
  ) {}

  /**
   * 创建账号
   * @param user 账号数据
   */
  async create(data: UserLoginDto, options: UserServiceNS.CreateOptions) {
    const { account, password } = data;
    const iv = UserServiceBase.generateIV();
    const accountExists = await this.isRegister(account);
    
    if (accountExists) { 
      ResponseBody.throw(UserAccountResponse.REG_AC_EXISTS);
    }
    
    const user = new UserEntity({
      ...options,
      nickname: String(account).substr(-4),
      account,
      password: UserServiceBase.encryptionPwd(password, iv, account),
      iv,
    });

    return plainToClass(UserEntity, await user.save());
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


  /**
   * 检测账号是否注册
   * @param account 账号/邮箱
   * @returns 注册的账号信息 or 空
   */
  async isRegister(account: UserEntity['account']): Promise<UserEntity | null> {
    const key = /@/.test(account) ? 'email' : 'account';
    return await this.UserService.find({ [key]: account }, ['id'], false);
  }
}

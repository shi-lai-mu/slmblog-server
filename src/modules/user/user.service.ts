import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserLoginDto } from './dto/user.dto';
import { User } from '../../entity/user.entity';
import { FindConditions, FindOneOptions, Repository } from 'typeorm';
import { generateHash } from 'src/utils/crypto';
import { ResBaseException } from 'src/core/exception/res.exception';
import { ResponseBody, ResponseEnum } from 'src/constants/response';
import { UserServiceNS } from 'src/interface/user.interface';
import { plainToClass } from 'class-transformer';
import { RedisService } from '../redis/redis.service';


@Injectable()
export class UserService {
  private readonly users: UserLoginDto[] = [];

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly RedisService: RedisService,
  ) {}

  /**
   * 创建账号
   * @param user 账号数据
   */
  async create(data: UserLoginDto, options: UserServiceNS.CreateOptions) {
    const { account, password } = data;
    const iv = UserServiceBase.generateIV();
    const accountExists = await this.find({ account }, ['id'], false);
    
    if (accountExists) { 
      throw new ResBaseException(ResponseBody.USER.REG_AC_EXISTS);
    }
    
    const user = new User({
      ...options,
      nickname: String(account).substr(-4),
      account,
      password: UserServiceBase.encryptionPwd(password, iv, account),
      iv,
    });

    return plainToClass(User, await user.save());
  }


  /**
   * 登录账号
   * @param user 账号数据
   */
  async login(user: User, options: UserServiceNS.CreateOptions) {
    // const { account, password } = data;
    // const findUser = await this.find({ account });
    // const encryptionPwd = UserServiceBase.encryptionPwd(password, findUser ? findUser.iv : '', account);

    // // 账号密码校验
    // if (!findUser || encryptionPwd !== findUser.password) { 
    //   throw new ResBaseException(ResponseBody.USER.LOG_AC_PW_ERROR);
    // }
    // console.log(user.systemPlatform);
    
    options.systemPlatform = UserServiceBase.getSystemPlatform(options.systemPlatform);
    this.RedisService.setItem('user', `user-agent${user.id}`, user.systemPlatform);

    // 更新账号信息
    this.userRepository.update({ id: user.id }, {
      systemPlatform: options.systemPlatform,
      ip: options.ip,
      updateTime: new Date(),
    });

    return plainToClass(User, user);
  }


  /**
   * [输出模型] 通过定位 精准获取一个账号的信息
   * 
   * 包含：
   * - 签证token
   * - 去除隐私数据
   */
  async InputFind(findData: FindConditions<User>, select?: FindOneOptions<User>['select']) {
    return plainToClass(User, await this.find(findData, select));
  }


  /**
   * 通过定位 精准获取一个账号的信息
   * @param errReturn 未找到时是否报错退出
   */
  async find(findData: FindConditions<User>, select?: FindOneOptions<User>['select'], errReturn: boolean = true): Promise<User> {
    const findUser = await this.userRepository.findOne({ select, where: findData });
    if (!findUser && errReturn) {
      throw new ResBaseException(ResponseEnum.USER.FIND_USER_NULL);
    }
    return findUser;
  }


  /**
   * 获取其他用户数据
   * @param id 用户ID
   */
  async outherUser(id: User['id']): Promise<User|null> {
    return this.userRepository.findOne({
      select: [
        'id', 'nickname', 'avatarUrl', 'badge', 'createTime', 'gender', 'introduction'
      ],
      where: { id },
    }) || null;
  }
}


/**
 * 用户类 逻辑层基础类
 */
export class UserServiceBase {

  /**
   * 生成用户盐
   */
  static generateIV() {
    return Date.now()
      .toString(32)
      .substr(-7)
      .split('')
      .map(v => /[a-z]/.test(v) && Math.random() > .3 ? v.toLocaleUpperCase() : v)
      .join('')
    ;
  }


  /**
   * 生成用户密码hash
   * @param password 密码
   * @param account  账号
   * @param iv       盐
   */
  static encryptionPwd(password: User['password'], account: User['account'], iv: User['iv']) {
    return generateHash(generateHash(password + iv + account, 'md5'), 'sha256');
  }


  /**
   * 获取用户 平台版本
   */
  static getSystemPlatform(systemPlatform: string) {
    return (String(systemPlatform).match(/(MSIE|Firefox|Presto|QQBrowser|MetaSr|UCBrowser|Chrome|Safari|Edge|Macintosh|MicroMessenger|Baiduspider|PostmanRuntime)(\/[\d\.]+)?/i) || [''])[0];
  }
}

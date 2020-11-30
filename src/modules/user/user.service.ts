import { Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserLoginDto } from './dto/user.dto';
import { User } from '../../entity/user.entity';
import { FindConditions, FindOneOptions, Repository } from 'typeorm';
import { generateHash } from 'src/utils/crypto';
import { ResBaseException } from 'src/core/exception/res.exception';
import { ResponseBody } from 'src/constants/response';
import { UserServiceNS } from 'src/interface/user.interface';


@Injectable()
export class UserService {
  private readonly users: UserLoginDto[] = [];

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * 创建用户
   * @param user 用户数据
   */
  async create(data: UserLoginDto, options: UserServiceNS.CreateOptions) {
    const { account, password } = data;
    const iv = UserServiceBase.generateIV();

    const accountExists = await this.find({ account }, ['id']);
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

    return await user.save();
  }


  /**
   * 通过定位 精准获取一个用户的信息
   */
  async find(findData: FindConditions<User>, select: FindOneOptions<User>['select']): Promise<User> {
    return await this.userRepository.findOne({ select, where: findData});
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
}

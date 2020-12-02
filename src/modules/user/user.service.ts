import { Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserLoginDto } from './dto/user.dto';
import { User } from '../../entity/user.entity';
import { FindConditions, FindOneOptions, Repository } from 'typeorm';
import { generateHash } from 'src/utils/crypto';
import { ResBaseException } from 'src/core/exception/res.exception';
import { ResponseBody, ResponseEnum } from 'src/constants/response';
import { UserServiceNS } from 'src/interface/user.interface';
import { plainToClass } from 'class-transformer';
import { AuthService } from './auth/auth.service';


@Injectable()
export class UserService {
  private readonly users: UserLoginDto[] = [];

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly AuthService: AuthService,
  ) {}

  /**
   * 创建账号
   * @param user 账号数据
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
   * 登录账号
   * @param user 账号数据
   */
  async login(data: UserLoginDto, options: UserServiceNS.CreateOptions) {
    const { account, password } = data;
    const findUser = await this.find({ account });
    const encryptionPwd = UserServiceBase.encryptionPwd(password, findUser ? findUser.iv : '', account);

    // 账号密码校验
    if (!findUser || encryptionPwd !== findUser.password) { 
      throw new ResBaseException(ResponseBody.USER.LOG_AC_PW_ERROR);
    }

    findUser.token = this.AuthService.signToken(findUser);

    return plainToClass(User, findUser);
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
   */
  async find(findData: FindConditions<User>, select?: FindOneOptions<User>['select']): Promise<User> {
    const findUser = await this.userRepository.findOne({ select, where: findData});
    if (!findUser) {
      throw new ResBaseException(ResponseEnum.USER.FIND_USER_NULL);
    }
    return findUser;
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

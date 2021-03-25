
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindConditions, FindOneOptions, Repository } from "typeorm";

import { UserEntity } from "./entity/user.entity";

import { ResponseBody } from "src/constants/response";
import { UserAccountResponse } from "./modules/account/constants/account.response";



/**
 * 用户业务 逻辑层
 */
@Injectable()
export class UserService {

  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) {}

  /**
   * [输出模型] 通过定位 精准获取一个账号的信息
   * 
   * 包含：
   * - 签证token
   * - 去除隐私数据
   */
   async InputFind(findData: FindConditions<UserEntity>, select?: FindOneOptions<UserEntity>['select']) {
    return await this.find(findData, select);
  }


  /**
   * 通过定位 精准获取一个账号的信息
   * @param errReturn 未找到时是否报错退出
   */
  async find(findData: FindConditions<UserEntity>, select?: FindOneOptions<UserEntity>['select'], errReturn: boolean = true): Promise<UserEntity> {
    const findUser = await this.userRepository.findOne({ select, where: findData });
    if (!findUser && errReturn) {
      ResponseBody.throw(UserAccountResponse.FIND_USER_NULL);
    }
    return findUser;
  }


  /**
   * 获取其他用户数据
   * @param id 用户ID
   */
  async outherUser(id: UserEntity['id']): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      select: [
        'id', 'nickname', 'avatarUrl', 'badge', 'createTime', 'gender', 'introduction'
      ],
      where: { id },
    }) || null;
  }


  /**
   * 检测账号或邮箱是否注册
   * @param account 账号/邮箱
   * @returns 注册的账号信息 or 空
   */
  async isRegister(account: UserEntity['account']): Promise<UserEntity | null> {
    const key = /@/.test(account) ? 'email' : 'account';
    return await this.find({ [key]: account }, ['id'], false);
  }
}
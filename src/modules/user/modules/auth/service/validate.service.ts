import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, Repository } from 'typeorm';

import { UserEntity } from "src/modules/user/entity/user.entity";

import { UserService } from '../../../user.service';

import { UserStatus } from "../../../constants/entity.cfg";
import { NotifyResponse } from 'src/modules/notify/constants/response.cfg';
import { ResponseBody, Status } from "src/constants/response";
import { UserAccountResponse } from "../../account/constants/account.response";



/**
 * 用户业务 认证 逻辑层
 */
@Injectable()
export class UserAuthService {

  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    private readonly UserService: UserService,
  ) {}


  /**
   * 更新账号邮箱 且 账号设为激活状态
   * @param account 账号
   * @param email   邮箱
   */
  async updateAuthEmail(account: string, email: string) {
    const user = await this.UserService.find({ account }, [ 'id', 'status', 'email' ]);

    if (user) {
      if (user.email === email) {
        ResponseBody.throw(NotifyResponse.ACCOUNT_EMAIL_SAME);
      }

      await this.mustReachAccountStatus(user, UserStatus.InActive);
      const updateData: FindConditions<UserEntity> = { email };
      if (user.status === UserStatus.InActive) {
        updateData.status = UserStatus.Actived;
      }
      const update = await this.userRepository.update({ account }, updateData as UserEntity);
      return update.affected;
    } else ResponseBody.throw(UserAccountResponse.FIND_USER_NULL);
  }


  /**
   * 检测账号是否至少处于某种状态
   * @param user            账号信息
   * @param mustReachStatus 最低的状态
   */
  async mustReachAccountStatus(user: UserEntity, mustReachStatus: UserStatus) {
    if (user.status < mustReachStatus) {
      const { ACOOUNT_BANLIST, ACOOUNT_INACTIVE, ACOOUNT_NOT_LOGIN, ACOOUNT_ABNORMAL } = UserAccountResponse;
      let Error: Status = ACOOUNT_ABNORMAL;
      switch(user.status) {
        case UserStatus.Frozen:   Error = ACOOUNT_BANLIST;   break; // 已被冻结
        case UserStatus.Tourist:  Error = ACOOUNT_NOT_LOGIN; break; // 未登录
        case UserStatus.InActive: Error = ACOOUNT_INACTIVE;  break; // 未激活
      }
      ResponseBody.throw(Error);
    }
    return true;
  }
}
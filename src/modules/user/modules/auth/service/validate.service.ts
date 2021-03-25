import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, Repository } from 'typeorm';

import { UserEntity } from "src/modules/user/entity/user.entity";

import { UserAuthService } from "./auth.service";
import { UserService } from '../../../user.service';
import { UserAccountService } from "../../account/service/account.service";
import ConfigsService from "src/modules/coreModules/config/configs.service";
import { NotifyEmailService } from "src/modules/notify/modules/email/service/email.service";

import { UserStatus } from "../../../constants/entity.cfg";
import { ResponseBody, Status } from "src/constants/response";
import { UserAccountResponse } from "../../account/constants/account.response";
import { NotifyEmailResponse } from "src/modules/notify/modules/email/constants/email.response";
import { ValidateEmailDto } from "../../account/dto/account.dto";
import { NOTIFY_EMAIL } from "src/modules/notify/modules/email/constants";
import { formatJetlag, generateUUID } from "src/utils/collection";
import { shieldContent } from "src/utils/crypto";
import { SentMessageInfo } from "nodemailer";



/**
 * 用户业务 认证 逻辑层
 */
@Injectable()
export class UserAuthValidateService {

  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    private readonly UserService: UserService,
    private readonly ConfigService: ConfigsService,
    private readonly NotifyEmailService: NotifyEmailService,
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
        ResponseBody.throw(NotifyEmailResponse.ACCOUNT_EMAIL_SAME);
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


  /**
   * 发送 账号邮箱验证 邮件通知
   * @param query 账号&邮箱 入参
   * @returns 
   */
  async sendValidateAccountEmail(query: ValidateEmailDto) {
    const { SEND_COOLING_COUNT, SEND_COOLING_S, SEND_COOLING_TIME } = NOTIFY_EMAIL;
    const { web } = this.ConfigService;
    const { NotifyEmailService } = this;
    const { email, account } = query;
    const isRegister = await this.UserService.isRegister(account);

    if (!isRegister) ResponseBody.throw(NotifyEmailResponse.EMAIL_SEND_CUURENT_NOT_REG);

    const sendLogs = await NotifyEmailService.getLogs(email);
    const uuid = generateUUID();
    const content = {
      to: query.email,
      subject: '请验证您的邮箱',
      template: 'email',
      from: web.email.from,
      context: {
        email,
        systemAccount: account,
        uuid,
        account: shieldContent(account, 2, 2),
        host: web.host,
        supportEmail: web.email.support,
        validateUrl: `${web.host}/user/validate/email?uuid=${uuid}&code=${email}&n=${sendLogs.length}`,
        fromAddress: web.email.from.address,
        validateTimeString: formatJetlag(SEND_COOLING_S * 1000, '小时'),
        copyRight: `© 2018-${new Date().getFullYear()}, SlmBlog, ${web.host}.`,
        time: Date.now() + SEND_COOLING_TIME,
      },
    };
    
    await NotifyEmailService.sendPernission(email, sendLogs, SEND_COOLING_COUNT);
    const sendQuery: Status | SentMessageInfo = await NotifyEmailService.send(content);
    // 执行成功则记录状态
    if (sendQuery.status) {
      this.NotifyEmailService.logger(`${email}${sendLogs.length}`, JSON.stringify(content), 'EX', SEND_COOLING_S);
      return sendQuery.status;
    }
    return ResponseBody.throw(NotifyEmailResponse.EMAIL_SEND_ERROR);
  }
}
import * as JWT from 'jsonwebtoken'
import { JwtService } from '@nestjs/jwt'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindConditions, Repository } from 'typeorm'

import { UserEntity } from 'src/modules/user/entity/user.entity'

import { UserService } from 'src/modules/user/user.service'

import { UserAuthResponse } from '../constants/response'
import { JwtToken } from 'src/interface/global.interface'
import { Permission, UserStatus } from '../../../constants/entity.cfg'
import { ResponseBody, ResponseEnum, Status } from 'src/constants/response'
import { UserAccountResponse } from '../../account/constants/account.response'

/**
 * 用户业务 认证 逻辑层
 */
@Injectable()
export class UserAuthService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly UserService: UserService
  ) {}

  /**
   * 签证Token
   * @param user 用户信息
   */
  async signToken(user: UserEntity): Promise<string> {
    // 游客权限
    if (user.iv === Permission.Tourist) {
      delete user.iv
      return ''
    }

    // 此处为所有用户可获得身份信息的总入口
    if (user.status < UserStatus.InActive) {
      ResponseBody.throw(UserAccountResponse.ACCOUNT_ABNORMAL)
    }

    return await this.jwtService.sign({
      iv: user.iv, // 校验用户盐
      id: user.id, // 用户ID
    })
  }

  /**
   * 刷新令牌
   * @param token 令牌
   */
  async refreshJWT(token: string) {
    const { REFRESH_JWT_QUERY, REFRESH_JWT_ERROR, REFRESH_JWT_INVAL } = UserAuthResponse
    const [, jwt] = token?.split(/\s+/)
    if (!token || !jwt) return ResponseEnum.UNAUTHORIZED

    if (jwt) {
      const jwtVerify = await new Promise<JwtToken | Error | string>(resolve => {
        JWT.verify(
          jwt,
          process.env.APP_JWT_SECRET,
          {
            ignoreExpiration: true,
          },
          (err, data) => {
            if (!err && data) return resolve(data)
            resolve(err || '数据解析失败')
          }
        )
      })

      if (jwtVerify instanceof Error) return REFRESH_JWT_INVAL
      if (jwtVerify instanceof String) return { ...REFRESH_JWT_ERROR, result: jwtVerify }

      const { iv, id } = jwtVerify as JwtToken
      if (iv && id) {
        const userFind = await this.UserService.find({ id, iv }, ['id', 'iv', 'status'])
        return { token: await this.signToken(userFind) }
      } else return REFRESH_JWT_QUERY
    }

    return REFRESH_JWT_ERROR
  }

  /**
   * 更新账号邮箱 且 账号设为激活状态
   * @param account 账号
   * @param email   邮箱
   */
  async updateAuthEmail(account: string, email: string) {
    const user = await this.UserService.find({ account }, ['id', 'status', 'email'])

    if (user) {
      if (user.email === email && user.status === UserStatus.Actived) {
        // ResponseBody.throw(NotifyEmailResponse.ACCOUNT_EMAIL_SAME);
        return true
      }

      await this.mustReachAccountStatus(user, UserStatus.InActive)
      const updateData: FindConditions<UserEntity> = { email }
      if (user.status === UserStatus.InActive) {
        updateData.status = UserStatus.Actived
      }
      const update = await this.userRepository.update({ account }, updateData as UserEntity)
      return update.affected
    } else ResponseBody.throw(UserAccountResponse.FIND_USER_NULL)
  }

  /**
   * 检测账号是否至少处于某种状态
   * @param user            账号信息
   * @param mustReachStatus 最低的状态
   */
  async mustReachAccountStatus(user: UserEntity, mustReachStatus: UserStatus) {
    if (user.status < mustReachStatus) {
      const { ACCOUNT_BANLIST, ACCOUNT_INACTIVE, ACCOUNT_NOT_LOGIN, ACCOUNT_ABNORMAL } =
        UserAccountResponse
      let Error: Status = ACCOUNT_ABNORMAL
      switch (user.status) {
        case UserStatus.Frozen:
          Error = ACCOUNT_BANLIST
          break // 已被冻结
        case UserStatus.Tourist:
          Error = ACCOUNT_NOT_LOGIN
          break // 未登录
        case UserStatus.InActive:
          Error = ACCOUNT_INACTIVE
          break // 未激活
      }
      ResponseBody.throw(Error)
    }
    return true
  }
}

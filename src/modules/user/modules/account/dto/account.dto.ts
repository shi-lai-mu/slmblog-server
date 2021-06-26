import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, Length } from 'class-validator'

import { USER_ACCOUNT_CONSTANTS } from '../constants'
import { ValidateThrow } from 'src/constants/response'
import { UserAccountResponse } from '../constants/account.response'
import { NotifyEmailResponse } from 'src/modules/notify/modules/email/constants/email.response'

/** 用户账号 */
export class UserAccountDto {
  /** 账号 */
  @IsNotEmpty(ValidateThrow(UserAccountResponse.ACCOUNT_EMPTY))
  @Length(
    USER_ACCOUNT_CONSTANTS.ACCOUNT_MIN_LENGTH,
    USER_ACCOUNT_CONSTANTS.ACCOUNT_MAX_LENGTH,
    ValidateThrow(UserAccountResponse.ACCOUNT_FORMAT)
  )
  @ApiProperty({
    description: `账号 (长度限制：${USER_ACCOUNT_CONSTANTS.ACCOUNT_MIN_LENGTH}~${USER_ACCOUNT_CONSTANTS.ACCOUNT_MAX_LENGTH})`,
    default: 'shilaimu',
  })
  account: string
}

/** 用户登录 */
export class UserLoginDto extends UserAccountDto {
  /** 密码 */
  @IsNotEmpty(ValidateThrow(UserAccountResponse.PASSWORD_EMPTY))
  @Length(
    USER_ACCOUNT_CONSTANTS.PASSWORD_MIN_LENGTH,
    USER_ACCOUNT_CONSTANTS.PASSWORD_MAX_LENGTH,
    ValidateThrow(UserAccountResponse.PASSWORD_FORMAT)
  )
  @ApiProperty({
    description: `密码 (长度限制：${USER_ACCOUNT_CONSTANTS.PASSWORD_MIN_LENGTH}~${USER_ACCOUNT_CONSTANTS.PASSWORD_MAX_LENGTH})`,
    default: 'shilaimu',
  })
  password: string
}

/** 用户注册 */
export class UserRegisterDto extends UserLoginDto {
  /** 邮箱 */
  @IsNotEmpty(ValidateThrow(NotifyEmailResponse.EMAIL_PARAMS_EMPTY))
  @IsEmail({}, ValidateThrow(NotifyEmailResponse.EMAIL_PARAMS_FORMAT))
  @ApiProperty({
    description: '邮箱 (必须为邮箱格式)',
    default: 'xxxxxxxxx@qq.com',
  })
  email: string

  /** 禁止自动发送验证邮件 */
  @ApiProperty({
    description: '禁止自动发送验证邮件',
    default: false,
    required: false,
  })
  notSend?: boolean
}

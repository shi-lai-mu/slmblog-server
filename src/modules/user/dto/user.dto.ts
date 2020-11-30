import { IsString, Length, MinLength } from 'class-validator';
import { USER_CONSTANTS } from '../../../constants/constants';
import { ResponseEnum } from '../../../constants/response';

export class UserBaseDto {
  /**
   * 用户ID
   */
  @MinLength(1)
  @IsString()
  id: number;
  /**
   * 昵称
   */
  nickname: string;
}

/**
 * 用户登录
 */
export class UserLoginDto {
  /**
   * 账号
   */
  @MinLength(1, ResponseEnum.USER.ACCOUNT_EMPTY)
  @Length(
    USER_CONSTANTS.ACCOUNT_MIN_LENGTH,
    USER_CONSTANTS.ACCOUNT_MAX_LENGTH,
    ResponseEnum.USER.ACCOUNT_FORMAT,
  )
  account: string;

  /**
   * 密码
   */
  @MinLength(1, ResponseEnum.USER.PASSWORD_EMPTY)
  @Length(USER_CONSTANTS.PASSWORD_MIN_LENGTH, USER_CONSTANTS.PASSWORD_MAX_LENGTH)
  password: string;
}
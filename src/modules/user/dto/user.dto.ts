import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length, MinLength } from 'class-validator';

import { USER_CONSTANTS } from '../../../constants/constants';
import { ResponseEnum, ValidateThrow } from '../../../constants/response';



/**
 * 用户基础数据入参
 */
export class UserBaseDto {
  /**
   * 用户ID
   */
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
  @IsNotEmpty(ResponseEnum.USER.ACCOUNT_EMPTY)
  @Length(USER_CONSTANTS.ACCOUNT_MIN_LENGTH, USER_CONSTANTS.ACCOUNT_MAX_LENGTH, ValidateThrow(ResponseEnum.USER.ACCOUNT_FORMAT))
  @ApiProperty({
    description: '账号',
    default: 'shilaimu',
  })
  account: string;

  /**
   * 密码
   */
  @IsNotEmpty(ResponseEnum.USER.PASSWORD_EMPTY)
  @Length(USER_CONSTANTS.PASSWORD_MIN_LENGTH, USER_CONSTANTS.PASSWORD_MAX_LENGTH)
  @ApiProperty({
    description: '密码',
    default: 'shilaimu',
  })
  password: string;
}


/**
 * 用户注册
 */
export class UserRegisterDto {
  /**
   * 账号
   */
  @MinLength(1, ResponseEnum.USER.ACCOUNT_EMPTY)
  @Length(USER_CONSTANTS.ACCOUNT_MIN_LENGTH, USER_CONSTANTS.ACCOUNT_MAX_LENGTH, ResponseEnum.USER.ACCOUNT_FORMAT)
  @ApiProperty({
    description: '账号',
    default: 'shilaimu',
  })
  account: string;

  /**
   * 密码
   */
  @MinLength(1, ResponseEnum.USER.PASSWORD_EMPTY)
  @Length(USER_CONSTANTS.PASSWORD_MIN_LENGTH, USER_CONSTANTS.PASSWORD_MAX_LENGTH)
  @ApiProperty({
    description: '密码',
    default: 'shilaimu',
  })
  password: string;
}
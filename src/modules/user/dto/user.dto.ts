import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

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
  @IsNotEmpty(ValidateThrow(ResponseEnum.USER.ACCOUNT_EMPTY))
  @Length(USER_CONSTANTS.ACCOUNT_MIN_LENGTH, USER_CONSTANTS.ACCOUNT_MAX_LENGTH, ValidateThrow(ResponseEnum.USER.ACCOUNT_FORMAT))
  @ApiProperty({
    description: '账号',
    default: 'shilaimu',
  })
  account: string;


  /**
   * 密码
   */
  @IsNotEmpty(ValidateThrow(ResponseEnum.USER.ACCOUNT_EMPTY))
  @Length(
    USER_CONSTANTS.ACCOUNT_MIN_LENGTH,
    USER_CONSTANTS.ACCOUNT_MAX_LENGTH,
    ValidateThrow(ResponseEnum.USER.ACCOUNT_FORMAT)
  )
  @ApiProperty({
    description: `账号 (长度限制：${USER_CONSTANTS.ACCOUNT_MIN_LENGTH}~${USER_CONSTANTS.ACCOUNT_MAX_LENGTH})`,
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
  @IsNotEmpty(ValidateThrow(ResponseEnum.USER.ACCOUNT_EMPTY))
  @Length(
    USER_CONSTANTS.ACCOUNT_MIN_LENGTH,
    USER_CONSTANTS.ACCOUNT_MAX_LENGTH,
    ValidateThrow(ResponseEnum.USER.ACCOUNT_FORMAT)
  )
  @ApiProperty({
    description: `账号 (长度限制：${USER_CONSTANTS.ACCOUNT_MIN_LENGTH}~${USER_CONSTANTS.ACCOUNT_MAX_LENGTH})`,
    default: 'shilaimu',
  })
  account: string;


  /**
   * 密码
   */
  @IsNotEmpty(ValidateThrow(ResponseEnum.USER.PASSWORD_EMPTY))
  @Length(
    USER_CONSTANTS.PASSWORD_MIN_LENGTH,
    USER_CONSTANTS.PASSWORD_MAX_LENGTH,
    ValidateThrow(ResponseEnum.USER.PASSWORD_FORMAT),
  )
  @ApiProperty({
    description: `密码 (长度限制：${USER_CONSTANTS.PASSWORD_MIN_LENGTH}~${USER_CONSTANTS.PASSWORD_MAX_LENGTH})`,
    default: 'shilaimu',
  })
  password: string;


  /**
   * 邮箱
   */
  @IsNotEmpty(ValidateThrow(ResponseEnum.USER.EMAIL_EMPTY))
  @IsEmail({}, ValidateThrow(ResponseEnum.USER.EMAIL_FORMA))
  @ApiProperty({
    description: '邮箱 (必须为邮箱格式)',
  })
  email: string;


  /**
   * 验证码
   */
  @IsNotEmpty(ValidateThrow(ResponseEnum.USER.CODE_EMPTY))
  @Length(
    USER_CONSTANTS.CODE_LENGTH,
    USER_CONSTANTS.CODE_LENGTH,
    ResponseEnum.USER.CODE_LENGTH,
  )
  @ApiProperty({
    description: `验证码 (长度限制：${USER_CONSTANTS.CODE_LENGTH})`,
  })
  code: string;
}
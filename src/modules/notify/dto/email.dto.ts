import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

import { ResponseEnum, ValidateThrow } from "src/constants/response";

/**
 * 注册账号 邮箱验证码通知 输入校验
 */
export class NotifyEmailRegisterAccountDto {
  /**
   * 邮箱
   */
   @IsNotEmpty(ValidateThrow(ResponseEnum.USER.EMAIL_EMPTY))
   @IsEmail({}, ValidateThrow(ResponseEnum.USER.EMAIL_FORMA))
   @ApiProperty({
     description: '邮箱 (必须为邮箱格式)',
   })
   email: string;
}
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, Length } from "class-validator";
import { ResponseEnum, ValidateThrow } from "src/constants/response";
import { NOTIFY_EMAIL } from "src/modules/notify/constants/controller.cfg";



/**
 * 验证账号邮箱 入参校验
 */
export class ValidateAccountEmailDto {
  /**
   * 邮箱
   */
  @IsNotEmpty(ValidateThrow(ResponseEnum.NOTIFY.EMAIL_PARAMS_EMPTY))
  @IsEmail({}, ValidateThrow(ResponseEnum.NOTIFY.EMAIL_PARAMS_FORMAT))
  @ApiProperty({
    description: '邮箱 (必须为邮箱格式)',
    default: 'xxxxxxxxx@xx.xxx',
  })
  email: string;

  /**
   * 序列ID
   */
  @IsNotEmpty(ValidateThrow(ResponseEnum.NOTIFY.EMAIL_VALIDATE_ID_EMPTY))
  @IsNumber({}, ValidateThrow(ResponseEnum.NOTIFY.EMAIL_VALIDATE_ID_FORMAT))
  @ApiProperty({
    description: `序列ID (此值只可能为** 0~${NOTIFY_EMAIL.SEND_COOLING_COUNT - 1} **)`,
  })
  id: number;

  /**
   * UUID
   */
  @IsNotEmpty(ValidateThrow(ResponseEnum.NOTIFY.EMAIL_VALIDATE_UUID_EMPTY))
  @Length(37, 39, ValidateThrow(ResponseEnum.NOTIFY.EMAIL_VALIDATE_UUID_FORMAT))
  @ApiProperty({
    description: `验证邮箱用的UUID，唯一序列号，只有\`序列ID\`和\`序列号\`对应才能成功验证邮箱`,
    default: 'xxxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  uuid: string;
}
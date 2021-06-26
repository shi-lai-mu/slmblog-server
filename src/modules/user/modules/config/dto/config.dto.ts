import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, ValidateIf } from 'class-validator'

import { UserConfigResponse } from '../constants/response'
import { ValidateIsJsonString, ValidateThrow } from 'src/constants/response'

/**
 * 保存用户信息入参
 */
export class SaveUserConfigDto {
  @ApiProperty({
    description: '配置文件信息',
    default: '{}',
  })
  @IsNotEmpty(ValidateThrow(UserConfigResponse.SAVE_JSON_EMPTY))
  @ValidateIf((val: SaveUserConfigDto) => ValidateIsJsonString(val.json))
  json: string
}

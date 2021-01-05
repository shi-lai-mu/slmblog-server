import { IsJSON, IsNotEmpty, IsNotEmptyObject, Validate, ValidateIf } from "class-validator";
import { ResponseEnum, ValidateIsJsonString, ValidateThrow } from "src/constants/response";
import { isJsonString } from "src/utils/collection";

/**
 * 保存用户信息入参
 */
export class SaveUserConfigDto {
  @IsNotEmpty(ValidateThrow(ResponseEnum.CONFIG.SAVE_JSON_EMPTY))
  @ValidateIf((val: SaveUserConfigDto) => ValidateIsJsonString(val.json))
  json: string;
}
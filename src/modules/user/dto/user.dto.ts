import { IsString, MinLength } from 'class-validator';

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
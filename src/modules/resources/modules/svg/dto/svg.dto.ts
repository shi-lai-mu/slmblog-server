import { ApiProperty } from "@nestjs/swagger";

import { RandomAvatarsGender, RandomAvatarsMood } from '../constants';



/**
 * 生成SVG头像入参
 */
export class GenerateSVGAvatarsDTO {
  /**
   * 昵称
   */
  @ApiProperty({
    description: '昵称',
    default: '史莱姆',
  })
  nickname: string;


  /**
   * 性别
   */
  @ApiProperty({
    description: '性别 <br> `female(女)` `male(男)` `human(人类)`',
    enum: RandomAvatarsGender,
    type: 'enum',
    default: RandomAvatarsGender.male,
  })
  gender?: RandomAvatarsGender;
}

/**
 * 生成SVG头像选参
 */
export class GenerateSVGAvatarsOptionsDTO {
  /**
   * 情绪
   */
  @ApiProperty({
    description: '情绪 <br> `surprised(惊讶的)` `happy(开心的)` `sad(悲伤的)`',
    enum: RandomAvatarsMood,
    type: 'enum',
    default: undefined,
  })
  mood?: RandomAvatarsMood;
}
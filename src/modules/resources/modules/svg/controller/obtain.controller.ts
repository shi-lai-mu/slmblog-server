import Avatars from '@dicebear/avatars'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import maleSprites from '@dicebear/avatars-male-sprites'
import humanSprites from '@dicebear/avatars-human-sprites'
import femaleSprites from '@dicebear/avatars-female-sprites'
import { Controller, Get, Header, Param, Query } from '@nestjs/common'

import { MainCPrefix } from 'src/modules/resources/constants'
import {
  GenerateSVGAvatarsDTO,
  GenerateSVGAvatarsOptionsDTO,
} from 'src/modules/resources/modules/svg/dto/svg.dto'

/**
 * 资源业务 SVG获取控制器
 */
@Controller(MainCPrefix)
@ApiTags('资源-SVG')
export class ResourcesSVGObtainController {
  /**
   * 获取随机生成的用户头像
   * @returns svg资源
   */
  @Get('avatars/:gender/:nickname.svg')
  @ApiOperation({
    summary: '获取随机生成的用户头像 列如游客留言',
    description: '头像是根据昵称随机生成的',
  })
  @Header('Content-Type', 'image/svg+xml')
  @Header('Cache-Control', 'max-age=60000')
  async generateAvatars(
    @Param() avatarsDTO: GenerateSVGAvatarsDTO,
    @Query() options: GenerateSVGAvatarsOptionsDTO = {}
  ) {
    const sprites = {
      female: femaleSprites, // 女
      male: maleSprites, // 男
      human: humanSprites, // 人类
    }
    const avatar = new Avatars<any>(sprites[avatarsDTO.gender] || sprites.human, {
      mood: [options.mood],
    })
    return avatar.create(avatarsDTO.nickname)
  }
}

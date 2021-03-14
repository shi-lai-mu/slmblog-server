import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

import { UserEntity } from "src/modules/user/entity/user.entity";

import { ArticleBehaviorService } from "../service/behavior.service";

import { LoveLogDto } from "../dto/behavior.dto";
import { MainCPrefix } from "../constants/controller.cfg";
import { JwtAuthGuard } from "src/core/strategy/jwt.strategy";
import { CurUser } from "src/core/decorators/global.decorators";



/**
 * 文章业务 行为 控制层
 */
@Controller(MainCPrefix + '/behavior')
@ApiTags('文章-行为')
export class ArticleBehaviorController {

  constructor(
    private readonly ArticleBehaviorService: ArticleBehaviorService,
  ) {}

  /**
   * 提交用户行为 对评论 点赞/点踩
   * @param loveLog 踩赞行为
   */
   @Post('good')
   @UseGuards(JwtAuthGuard)
   @ApiOperation({
     summary: '提交用户行为 对评论 点赞/点踩',
     description: '当用户点击评论赞或者踩时调用此接口记录行为',
   })
   @ApiBearerAuth()
   async doLoveCheckLog(@Body() loveLog: LoveLogDto, @CurUser() user: UserEntity) {
     return this.ArticleBehaviorService.doLoveCheckLog(loveLog, user);
   }
}
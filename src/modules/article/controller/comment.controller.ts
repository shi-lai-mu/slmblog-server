import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CurUser } from "src/core/decorators/global.decorators";
import { JwtAuthGuard } from "src/core/strategy/jwt.strategy";
import { User } from "src/modules/user/entity/user.entity";
import { MainCPrefix } from "../constants/controller.cfg";
import { LoveLogDto } from "../dto/comment.dto";
import { ArticleCommentService } from "../service/comment.service";

/**
 * 文章业务 评论 控制层
 */
@Controller(MainCPrefix + '/comment')
@ApiTags('文章')
export class ArticleCommentController {

  constructor(
    private readonly ArticleCommentService: ArticleCommentService,
  ) {}


  /**
   * 提交用户行为 对评论 点赞/点踩
   * @param loveLog 踩赞行为
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '提交用户行为 对评论 点赞/点踩',
    description: '当用户点击评论赞或者踩时调用此接口记录行为',
  })
  @ApiBearerAuth()
  async doLoveCheckLog(@Body() loveLog: LoveLogDto, @CurUser() user: User) {
    return this.ArticleCommentService.doLoveCheckLog(loveLog, user);
  }

}
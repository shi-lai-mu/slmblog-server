import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

import { UserEntity } from "src/modules/user/entity/user.entity";

import { ArticleCommentService } from "../service/comment.service";

import { isNickname } from "src/utils/regexp";
import { ResponseBody } from "src/constants/response";
import { MainCPrefix } from "../../../constants/controller.cfg";
import { ArticleResponse } from "../../../constants/response.cfg";
import { CurUser } from "src/core/decorators/global.decorators";
import { Permission } from "src/modules/user/constants/entity.cfg";
import { JwtPermissionStrategy } from "src/core/strategy/jwt.strategy";
import { FetchArticleCommentPageDto, SendArticleCommentDto } from "../dto/comment.dto";
import { NotifyEmailResponse } from "src/modules/notify/modules/email/constants/email.response";



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
   * 发表评论
   */
  @Post('/:articleId')
  @ApiOperation({
    summary: '发表评论',
    description: '发表评论内容包含敏感词检测',
  })
  @ApiParam({
    name: 'articleId',
    description: '文章ID',
  })
  @UseGuards(new JwtPermissionStrategy(Permission.Tourist))
  @ApiBearerAuth()
  async send(
    @Body() sendArticleComment: SendArticleCommentDto,
    @Param('articleId') articleId: string,
    @CurUser() user?: UserEntity,
  ) {
    if (!user.id) {
      if (!sendArticleComment.nickname) {
        ResponseBody.throw(ArticleResponse.SEND_COMMENT_NICKNAME_EMPTY);
      }
      if (!sendArticleComment.email) {
        ResponseBody.throw(NotifyEmailResponse.EMAIL_PARAMS_EMPTY);
      }
      isNickname(sendArticleComment.nickname);
    } else {
      sendArticleComment.nickname = '';
      sendArticleComment.email = '';
    }
    sendArticleComment.content = sendArticleComment.content.trim();
    return this.ArticleCommentService.send(articleId, sendArticleComment, user);
  }


  /**
   * 分页 获取文章评论
   */
  @Get('/:articleId/:page/:pageSize')
  @ApiOperation({
    summary: '分页 获取文章评论',
    description: '分页 获取文章的评论',
  })
  async getCommentList(@Param() params: FetchArticleCommentPageDto) {
    const { articleId, page, pageSize } = params;
    return this.ArticleCommentService.getArticleComment(articleId, page, pageSize);
  }
}
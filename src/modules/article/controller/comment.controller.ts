import { Body, Controller, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

import { UserEntity } from "src/modules/user/entity/user.entity";

import { ArticleCommentService } from "../service/comment.service";

import { MainCPrefix } from "../constants/controller.cfg";
import { SendArticleCommentDto } from "../dto/comment.dto";
import { ArticleResponse } from "../constants/response.cfg";
import { CurUser } from "src/core/decorators/global.decorators";
import { UserRole } from "src/modules/user/constants/entity.cfg";
import { ResBaseException } from "src/core/exception/res.exception";
import { JwtPermissionStrategy } from "src/core/strategy/jwt.strategy";
import { NotifyResponse } from "src/modules/notify/constants/response.cfg";



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
  @UseGuards(new JwtPermissionStrategy(UserRole.Tourist))
  @ApiBearerAuth()
  async send(
    @Body() sendArticleComment: SendArticleCommentDto,
    @Param('articleId') articleId: string,
    @CurUser() user?: UserEntity,
  ) {
    if (!user.id) {
      if (!sendArticleComment.nickname) {
        throw new ResBaseException(ArticleResponse.SEND_COMMENT_NICKNAME_EMPTY);
      }
      if (!sendArticleComment.email) {
        throw new ResBaseException(NotifyResponse.EMAIL_PARAMS_EMPTY);
      }
    } else {
      sendArticleComment.nickname = '';
    }
    return this.ArticleCommentService.send(articleId, sendArticleComment, user);
  }
}
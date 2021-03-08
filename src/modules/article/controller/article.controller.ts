import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

import { User } from "src/modules/user/entity/user.entity";

import { ArticleService } from "../service/article.service";

import { ArticleSubmitDto } from "../dto/article.dto";
import { MainCPrefix } from "../constants/controller.cfg";
import { JwtAuthGuard } from "src/core/strategy/jwt.strategy";
import { CurUser } from "src/core/decorators/global.decorators";
import { UserStatus } from "src/modules/user/constants/entity.cfg";
import { ResponseBody, ResponseEnum } from "src/constants/response";
import { ArticleStateEnum } from "src/modules/article/constants/entity.cfg";



@Controller(MainCPrefix)
@ApiTags('文章')
export class ArticleController {

  constructor(
    private readonly ArticleService: ArticleService,
  ) {}


  /**
   * 发布文章
   * @param articleData 文章数据
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '发布文章',
    description: '用于发布文章',
  })
  @ApiBearerAuth()
  async submit(@Body() articleData: ArticleSubmitDto, @CurUser() user: User) {
    // 发布权
    if (user.status !== UserStatus.Actived) {
      ResponseBody.throw(ResponseEnum.ARTICLE.AC_SUBMIT_ERROR);
    }
    return this.ArticleService.submit(articleData, user);
  }


  /**
   * 获取文章内容
   * @param id 文章ID
   */
  @Get(':id')
  @ApiOperation({
    summary: '获取文章内容',
    description: '获取文章的详细信息，包含评论',
  })
  async information(@Param('id') id: number) {
    return this.ArticleService.information(id);
  }


  /**
   * 根据模式获取列表
   * @param filterMode 过滤模式
   * @param page       页数
   * @param count      列数
   */
  @Get(':filterMode/:page/:count')
  @ApiOperation({
    summary: '获取文章列表',
    description: '通过过滤模式获取各种状态的文章列表',
  })
  @ApiParam({
    name: 'filterMode',
    enum: ArticleStateEnum,
    description: '文章过滤类型',
  })
  async captureList(
    @Param('filterMode') filterMode: keyof typeof ArticleStateEnum,
    @Param('page') page: number,
    @Param('count') count: number,
  ) {
    return this.ArticleService.getFilterList(filterMode, page, count);
  }


  // @get('')
}
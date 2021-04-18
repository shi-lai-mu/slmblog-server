import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";

import { UserEntity } from "src/modules/user/entity/user.entity";
import { Article } from "./entity/article.entity";

import { ArticleService } from "./article.service";

import { ArticleSubmitDto } from "./dto/article.dto";
import { MainCPrefix } from "./constants/controller.cfg";
import { JwtAuthGuard, JwtPermissionStrategy } from "src/core/strategy/jwt.strategy";
import { CurUser } from "src/core/decorators/global.decorators";
import { Permission, UserStatus } from "src/modules/user/constants/entity.cfg";
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
  async submit(@Body() articleData: ArticleSubmitDto, @CurUser() user: UserEntity) {
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
  @ApiOkResponse({ type: Article })
  @UseGuards(new JwtPermissionStrategy(Permission.Tourist))
  @ApiBearerAuth()
  async information(
    @Param('id') id: number,
    @CurUser() user?: UserEntity,
  ) {
    return this.ArticleService.information(id, user);
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


  /**
   * 获取文章简洁信息
   */
  @Get('profile/list')
  @ApiOperation({
    summary: '获取文章简洁信息',
    description: '获取文章简洁的信息，等同于文章列表',
  })
  @ApiQuery({
    name: 'ids',
    description: '筛选的文章ids（入参如：[1,2,3] 或 1 ）',
  })
  async profile(@Query('ids') ids: number | string) {
    return this.ArticleService.profile(ids);
  }
}
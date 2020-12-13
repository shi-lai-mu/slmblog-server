import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { APIPrefix } from "src/constants/constants";
import { ResponseBody, ResponseEnum } from "src/constants/response";
import { CurUser } from "src/core/decorators/global.decorators";
import { User, UserStatus } from "src/entity/user.entity";
import { JwtAuthGuard } from "../user/auth/jwt.strategy";
import { ArticleService } from "./article.service";
import { ArticleSubmitDto } from "./dto/article.dto";

@Controller(APIPrefix + 'article')
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
  @ApiOperation({ summary: '发布文章' })
  async submit(@Body() articleData: ArticleSubmitDto, @CurUser() user: User) {
    // 发布权
    if (user.status !== UserStatus.Actived) {
      ResponseBody.throw(ResponseEnum.ARTICLE.AC_SUBMIT_ERROR);
    }
    
    return this.ArticleService.submit(articleData);
  }


  /**
   * 获取文章内容
   * @param id 文章ID
   */
  @Get(':id')
  @ApiOperation({ summary: '获取文章内容'})
  async information(@Param('id') id: number) {
    return this.ArticleService.information(id);
  }
}
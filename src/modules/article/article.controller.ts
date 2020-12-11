import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { APIPrefix } from "src/constants/constants";
import { ArticleService } from "./article.service";
import { ArticleSubmitDto } from "./dto/article.dto";

@Controller(APIPrefix + 'article')
@ApiTags('文章')
export class ArticleController {

  constructor(
    private readonly ArticleService: ArticleService,
  ) {}


  @Post()
  @ApiOperation({ summary: '发布文章' })
  submit(@Body() articleData: ArticleSubmitDto) {
    console.log(articleData);
  }


  /**
   * 获取文章内容
   * @param id 文章ID
   */
  @Get(':id')
  @ApiOperation({ summary: '获取文章内容'})
  info(@Param('id') id: number) {
    // this.ArticleService.
  }
}
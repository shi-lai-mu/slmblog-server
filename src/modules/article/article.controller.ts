import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { APIPrefix } from "src/constants/constants";
import { ResponseBody, ResponseEnum } from "src/constants/response";
import { CurUser } from "src/core/decorators/global.decorators";
import { User, UserStatus } from "src/entity/user.entity";
import { JwtAuthGuard } from "../user/auth/jwt.strategy";
import { ArticleService } from "./article.service";
import { ArticleSubmitDto } from "./dto/article.dto";
import { sensitiveWord } from "src/configs/sensitive.word";
import Mint from 'mint-filter'

const mint = new Mint(sensitiveWord);

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
  submit(@Body() articleData: ArticleSubmitDto, @CurUser() user: User) {
    // 发布权
    if (user.status !== UserStatus.Actived) {
      ResponseBody.throw(ResponseEnum.ARTICLE.AC_SUBMIT_ERROR);
    }

    // 敏感词
    const content = (articleData.content + articleData.description + articleData.title).replace(/\s|\n|\r|\t|\-|\_|[a-z0-9]/g, '');
    const isMintContent = mint.filterSync(content, { every: false, replace: false });
    if (isMintContent.words.length) {
      const errMsg = ResponseEnum.ARTICLE.SUB_IS_SENSITIVE;
      errMsg.message = errMsg.message.replace('%s', isMintContent.words[0]);
      ResponseBody.throw(errMsg);
    }
    
    this.ArticleService.submit(articleData);
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
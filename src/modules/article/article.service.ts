import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Article, ArticleStateEnum } from "src/entity/article.entity";
import { Repository } from "typeorm";
import { RedisService } from "../redis/redis.service";
import { ArticleSubmitDto } from "./dto/article.dto";
import { sensitiveWord } from "src/configs/sensitive.word";
import { ResponseBody, ResponseEnum } from "src/constants/response";
import { ArticleNS } from "./type/article";
import { responseList, skipPage, ValidateParams } from "src/utils/collection";
import Mint from 'mint-filter'


/**
 * 文章业务 逻辑层
 */
@Injectable()
export class ArticleService {

  /**
   * 敏感词 检测/过滤 器
   */
  static readonly SensitiveWord = new Mint(sensitiveWord);

  constructor(
    @InjectRepository(Article) private readonly ArticleRepository: Repository<Article>,
    private readonly RedisService: RedisService,
  ) {}


  /**
   * 发布文章
   * @param articleData 文章数据
   */
  async submit(articleData: ArticleSubmitDto) {

    // 敏感词
    const content = (articleData.content + articleData.description + articleData.title).replace(/\s|\n|\r|\t|\-|\_|[a-z0-9]/g, '');
    const isMintContent = ArticleService.SensitiveWord.filterSync(content, { every: false, replace: false });
    if (isMintContent.words.length) {
      const errMsg = ResponseEnum.ARTICLE.SUB_IS_SENSITIVE;
      errMsg.message = errMsg.message.replace('%s', isMintContent.words.join(', '));
      ResponseBody.throw(errMsg);
    }

    // 插入数据确认
    const insert = await this.ArticleRepository.insert(articleData);
    if (!insert.raw.insertId) {
      ResponseBody.throw(ResponseEnum.ARTICLE.SUB_ARTICLE_ERROR);
    }
    
    return { id: insert.identifiers[0].id };
  }


  /**
   * 获取文章内容
   * @param id 文章ID
   */
  async information(id: Article['id']) {
    const { Failed, IsDelete, Examine } = ArticleStateEnum;
    const article = await this.ArticleRepository.findOne(id);

    // 文章状态检测
    const abnormalState = {
      '-2': ResponseEnum.ARTICLE.STATE_FAILED,
      '-1': ResponseEnum.ARTICLE.STATE_ISDELETE,
      0: ResponseEnum.ARTICLE.STATE_EXAMINE,
    };
    if (article.state < ArticleStateEnum.Routine) {
      ResponseBody.throw(abnormalState[article.state] || ResponseEnum.ARTICLE.STATE_ABNORMAL);
    }

    // 数据整合
    const information: ArticleNS.Information = {
      article,
      comment: [],
    };

    return information;
  }


  /**
   * 根据模式获取列表
   * @param filterMode 过滤模式
   * @param page       页数
   * @param count      列数
   */
  async getFilterList(filterMode: keyof typeof ArticleStateEnum, page: number, count: number) {
    ValidateParams
      .isPageOrCount(page, count)
      .isThisValues({ filterMode }, Object.keys(ArticleStateEnum))
    ;

    const [ list, total ] = await this.ArticleRepository.findAndCount({
      skip: skipPage(page, count),
      take: count,
    });

    return responseList(page, count, list, total);
  }
}
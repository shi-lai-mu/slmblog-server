import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Article } from "src/entity/article.entity";
import { Repository } from "typeorm";
import { RedisService } from "../redis/redis.service";
import { ArticleSubmitDto } from "./dto/article.dto";
import { sensitiveWord } from "src/configs/sensitive.word";
import { ResponseBody, ResponseEnum } from "src/constants/response";
import Mint from 'mint-filter'

const mint = new Mint(sensitiveWord);


/**
 * 文章业务 逻辑层
 */
@Injectable()
export class ArticleService {

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
    const isMintContent = mint.filterSync(content, { every: false, replace: false });
    if (isMintContent.words.length) {
      const errMsg = ResponseEnum.ARTICLE.SUB_IS_SENSITIVE;
      errMsg.message = errMsg.message.replace('%s', isMintContent.words[0]);
      ResponseBody.throw(errMsg);
    }

    // 插入数据确认
    const insert = await this.ArticleRepository.insert(articleData);
    if (!insert.raw.insertId) {
      ResponseBody.throw(ResponseEnum.ARTICLE.SUB_ARTICLE_ERROR);
    }
    
    return { id: insert.identifiers[0].id };
  }
}
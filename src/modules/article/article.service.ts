import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Article } from "src/entity/article.entity";
import { Repository } from "typeorm";
import { RedisService } from "../redis/redis.service";
import { ArticleSubmitDto } from "./dto/article.dto";

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
    this.ArticleRepository.insert(articleData);
  }
}
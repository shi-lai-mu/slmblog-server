import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Article } from "src/entity/article.entity";
import { Repository } from "typeorm";
import { RedisService } from "../redis/redis.service";

@Injectable()
export class ArticleService {

  constructor(
    @InjectRepository(Article) private readonly ArticleRepository: Repository<Article>,
    private readonly RedisService: RedisService,
  ) {}

}
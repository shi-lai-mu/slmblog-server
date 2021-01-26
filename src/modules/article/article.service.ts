import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Article, ArticleStat, ArticleStateEnum, ArticleTableName } from "src/entity/article.entity";
import { getConnection, Repository } from "typeorm";
import { RedisService } from "../redis/redis.service";
import { ArticleSubmitDto } from "./dto/article.dto";
import { sensitiveWord } from "src/configs/sensitive.word";
import { ResponseBody, ResponseEnum } from "src/constants/response";
import { ArticleNS } from "./type/article";
import { responseList, skipPage, ValidateParams } from "src/utils/collection";
import { User, UserTableName } from "src/entity/user.entity";
import Mint from 'mint-filter'
import { plainToClass } from "class-transformer";


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
   * @param author      发布者
   */
  async submit(articleData: ArticleSubmitDto, author: User) {
    // 敏感词
    const content = (articleData.content + articleData.description + articleData.subject).replace(/\s|\n|\r|\t|\-|\_|[a-z0-9]/g, '');
    const isMintContent = ArticleService.SensitiveWord.filterSync(content, { every: false, replace: false });
    if (isMintContent.words.length) {
      const errMsg = ResponseEnum.ARTICLE.SUB_IS_SENSITIVE;
      errMsg.message = errMsg.message.replace('%s', isMintContent.words.join(', '));
      ResponseBody.throw(errMsg);
    }

    // 系统数据写入
    const insertData: Article = articleData as Article;
    insertData.author = author.id;

    const connection = getConnection().createQueryRunner();
    await connection.connect();
    await connection.startTransaction();
    let insertArticleId = -1;

    try {
      insertData.setting = typeof insertData.setting === 'string'
        ? insertData.setting
        : JSON.stringify(insertData.setting)
      ;
      // 插入数据确认
      const insert = await connection.manager.insert(Article, insertData);
      if (!insert.raw.insertId) {
        ResponseBody.throw(ResponseEnum.ARTICLE.SUB_ARTICLE_ERROR);
      }
      insertArticleId = insert.identifiers[0].id;
      const insertStat = await connection.manager.insert(ArticleStat, {
        article: insertArticleId,
      });
      if (!insertStat.raw.insertId) {
        ResponseBody.throw(ResponseEnum.ARTICLE.SUB_ARTICLE_ERROR);
      }
      await connection.manager.update(Article, {
        id: insert.raw.insertId,
      }, {
        stat: insertStat.raw.insertId,
      });
      connection.commitTransaction();
    } catch(err) {
      await connection.rollbackTransaction();
      return err;
    }

    return { id: insertArticleId };
  }


  /**
   * 获取文章内容
   * @param id 文章ID
   */
  async information(id: Article['id']) {
    const { Failed, IsDelete, Examine } = ArticleStateEnum;
    const { STATE_FAILED, STATE_ISDELETE, STATE_EXAMINE, STATE_ABNORMAL, STATE_NOT_EXISTS } = ResponseEnum.ARTICLE;
    const article = await this.ArticleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', UserTableName.USER)
      .leftJoinAndSelect('article.stat', ArticleTableName.STAT)
      .where({ id })
      .getOne()
    ;

    if (!article) return STATE_NOT_EXISTS;

    // 文章状态检测
    const abnormalState = {
      '-2': STATE_FAILED,
      '-1': STATE_ISDELETE,
      0: STATE_EXAMINE,
    };
    if (article.state < ArticleStateEnum.Routine) {
      ResponseBody.throw(abnormalState[article.state] || STATE_ABNORMAL);
    }

    // 数据整合
    const information: ArticleNS.Information = {
      article: this.articleDataFilter(article),
      comment: [],
    };

    (<any>information.article).replyCount = 0;

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

    let [ list, total ] = 
    await this.ArticleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', UserTableName.USER)
      .leftJoinAndSelect('article.stat', ArticleTableName.STAT)
      // .addSelect()
      .skip(skipPage(page, count))
      .take(count)
      .getManyAndCount()
    ;

    // 数据过滤
    list = list.map(data => {
      return this.articleDataFilter(data);
    });

    return responseList(page, count, list, total);
  }


  /**
   * 过滤文章数据
   * @param article 文章内容
   */
  articleDataFilter(article: ArticleNS.BaseData) {
    article.stat = plainToClass(ArticleStat, article.stat);
    article.author = plainToClass(User, article.author);
    return article;
  }
}
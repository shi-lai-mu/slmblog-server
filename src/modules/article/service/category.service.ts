import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ResBaseException } from "src/core/exception/res.exception";
import { User } from "src/modules/user/entity/user.entity";
import { Repository } from "typeorm";
import { ArticleCategoryResponse } from "../constants/response.cfg";
import { CreateArticleCategoryDto } from "../dto/category.dto";
import { ArticleCategory } from "../entity/categorys.entity";
import { ArticleCategoryNS, FindIdsParams } from '../type/category';

/**
 * 文章业务 类目 逻辑层
 */
@Injectable()
export class ArticleCategoryService {
  constructor(
    @InjectRepository(ArticleCategory) private readonly ArticleCategoryRepository: Repository<ArticleCategory>,
  ) {}

  /**
   * 创建类目
   * @param createCategory 创建类目入参
   * @param user           创建人用户信息
   */
  async create(createCategory: CreateArticleCategoryDto, user: User) {
    const { names, parentId, link } = createCategory;
    const findList = await this.ArticleCategoryRepository.find({ names });

    if (findList.length) {
      throw new ResBaseException(ArticleCategoryResponse.CREATE_EXISTS);
    }

    const categoryData = new ArticleCategory({
      names,
      parentId,
      link,
      create_user_id: user.id,
    });

    return categoryData.save();
  }


  /**
   * 获取类目详细信息
   * @param id 类目ID
   */
  async information(ids: FindIdsParams) {
    if (ids instanceof String) {
      ids = JSON.stringify(ids);
    }
    return this.ArticleCategoryRepository.findByIds(ids as ArticleCategory['id'][]);
  }


  /**
   * 获取类目信息
   */
  async list() {
    let all = await this.ArticleCategoryRepository.find({
      select: [ 'id', 'names', 'parentId', 'link' ],
    });

    const listObject: { [k: number]: ArticleCategoryNS.ResponseList } = {};
    all.forEach(item => {
      if (!item.parentId) {
        listObject[item.id] = item;
        listObject[item.id].childs = [];
      } else {
        listObject[item.parentId].childs.push(item);
      }
    });

    return Object.values(listObject);
  }
}
import { User } from "src/modules/user/entity/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { BaseInitEntity } from "../../../entity/baseInitEntity";
import { ArticleCategoryNS } from "../type/category";

/**
 * 文章业务 类目 实体
 */
@Entity({
  name: 'blog_article_category',
})
export class ArticleCategory extends BaseInitEntity<ArticleCategoryNS.CreateCategory> {
  /**
   * 类目ID
   */ 
  @PrimaryGeneratedColumn({
    comment: '类目ID',
  })
  id: number;

  /**
   * 类目名
   */
  @Column({
    comment: '类目名',
  })
  names: string;

  /**
   * 创建时间
   */
  @CreateDateColumn({
    name: 'create_time',
    comment: '创建时间',
    select: false,
  })
  createTime: Date;

  /**
   * 类目父级ID
   */
  @Column({
    name: 'parent_id',
    comment: '类目父级ID',
    default: 0,
    select: false,
  })
  parentId: number;

  /**
   * 指向链接
   */
  @Column({
    comment: '指向链接',
    default: '',
  })
  link?: string;

  /**
   * 创建用户ID
   */
  @ManyToOne(type => User, user => user.id)
  create_user_id: number;
}
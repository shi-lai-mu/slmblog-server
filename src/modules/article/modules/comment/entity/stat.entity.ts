import { Exclude } from "class-transformer";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { Article } from "src/modules/article/entity/article.entity";

import { BaseInitEntity } from "src/entity/baseInitEntity";
import { ArticleTableName } from "src/modules/article/constants/entity.cfg";



/**
 * 文章状态实体
 */
@Entity({ name: ArticleTableName.STAT })
export class ArticleStat extends BaseInitEntity<{}> {
  /**
   * 收藏ID
   */
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  /**
   * 目标文章
   */
  @ManyToOne(ts => Article, article => article.id)
  article: number;

  /**
   * 收藏次数
   */
  @Column({ default: 0, comment: '收藏次数' })
  bookmark_num: number;

  /**
   * 浏览次数
   */
  @Column({ default: 0, comment: '浏览次数' })
  view_num: number;

  /**
   * 是否为推荐
   */
  @Column({ default: 0, comment: '是否为推荐' })
  is_good: number;

  /**
   * 是否为官方
   */
  @Column({ default: 0, comment: '是否为官方' })
  is_official: number;

  /**
   * 是否为置顶
   */
  @Column({ default: 0, comment: '是否为置顶' })
  is_top: number;

  /**
   * 数据最后更新时间
   */
  @UpdateDateColumn({ name: 'update_time', comment: '数据最后更新时间' })
  @Exclude()
  updateTime: Date;

  /**
   * 操作人员
   */
  @Column({ default: 'system', comment: '操作人员' })
  @Exclude()
  operator: string;
}
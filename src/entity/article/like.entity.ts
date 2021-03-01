import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { User } from "../user.entity";
import { Article } from "./article.entity";
import { ArticleLikeStatus, ArticleTableName } from "./constants";
import { BaseInitEntity } from "../baseInitEntity";

/**
 * 点赞实体
 */
@Entity({ name: ArticleTableName.LIKE })
export class ArticleLike extends BaseInitEntity<{}> {
  @PrimaryGeneratedColumn()
  id: number;
  /**
   * 点赞用户
   */
  @ManyToOne(ts => User, user => user.id)
  user: number;
  /**
   * 点赞文章
   */
  @ManyToOne(ts => Article, article => article.id)
  article: number;
  /**
   * 点赞状态
   */
  @Column({ type: 'enum', enum: ArticleLikeStatus, default: ArticleLikeStatus.Approved, comment: '点赞状态' })
  status: ArticleLikeStatus;
  /**
   * 点赞时间
   */
  @CreateDateColumn({ name: 'create_time', comment:  '点赞时间' })
  createTime: Date;
}


import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { User } from "../../user/entity/user.entity";
import { Article } from "./article.entity";
import { ArticleLoveStatus, ArticleTableName, ArticleLoveTarget } from "../constants/entity.cfg";
import { BaseInitEntity } from "../../../entity/baseInitEntity";
import { ArticleCommentNS } from "../type/comment";

/**
 * 文章业务 踩赞 实体
 */
@Entity({ name: ArticleTableName.COMMENT_LOVE })
export class ArticleLove extends BaseInitEntity<ArticleCommentNS.CreateArticleLove> {
  @PrimaryGeneratedColumn({
    comment: '踩赞ID',
  })
  id: number;

  /**
   * 踩赞用户ID
   */
  @ManyToOne(ts => User, user => user.id)
  user: number;

  /**
   * 踩赞文章
   */
  @ManyToOne(ts => Article, article => article.id)
  article: number;

  /**
   * 评论目标
   */
  @Column({
    type: 'enum',
    enum: ArticleLoveTarget,
    default: ArticleLoveTarget.Comment,
    comment: '评论目标 (1: 文章， 2: 评论)',
  })
  target: ArticleLoveTarget;

  /**
   * 踩赞状态
   */
  @Column({
    type: 'enum',
    enum: ArticleLoveStatus,
    default: ArticleLoveStatus.Praise,
    comment: '踩赞状态',
  })
  status: ArticleLoveStatus;

  /**
   * 点赞时间
   */
  @CreateDateColumn({
    name: 'create_time',
    comment:  '点赞时间',
  })
  createTime: Date;
}


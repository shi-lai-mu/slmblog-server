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
   * 踩赞文章
   */
  @ManyToOne(ts => Article, article => article.id)
  article: number;

  /**
   * 点赞点踩用户ID
   */
  @Column({
    comment: '点赞点踩用户ID',
  })
  json: string;

  /**
   * 点赞人数
   */
  @Column({
    comment: '点赞人数',
  })
  praise: number;

  /**
   * 点踩人数
   */
  @Column({
    comment: '点踩人数',
  })
  criticism: number;

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
}


import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { User } from "../../user/entity/user.entity";
import { Article } from "./article.entity";
import { ArticleLikeStatus, ArticleTableName } from "../constants/entity.cfg";
import { BaseInitEntity } from "../../../entity/baseInitEntity";
import { ArticleComment } from "./comment.entity";

/**
 * 点赞实体
 */
@Entity({ name: ArticleTableName.LIKE })
export class ArticleCommentLike extends BaseInitEntity<{}> {
  @PrimaryGeneratedColumn()
  id: number;
  /**
   * 点赞用户
   */
  @ManyToOne(ts => User, user => user.id)
  user: number;
  /**
   * 点赞评论ID
   */
  @ManyToOne(ts => ArticleComment, comment => comment.id)
  comment: number;
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


import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { ArticleComment } from "./comment.entity";
import { UserEntity } from "src/modules/user/entity/user.entity";

import { BaseInitEntity } from "src/entity/baseInitEntity";
import { ArticleLikeStatus, ArticleTableName } from "src/modules/article/constants/entity.cfg";


/**
 * 点赞实体
 */
@Entity({ name: ArticleTableName.LIKE })
export class ArticleCommentLike extends BaseInitEntity<{}> {
  /**
   * 点赞ID
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 点赞用户
   */
  @ManyToOne(ts => UserEntity, user => user.id)
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


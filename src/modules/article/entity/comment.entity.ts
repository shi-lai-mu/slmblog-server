import { BaseInitEntity } from "src/entity/baseInitEntity";
import { User } from "src/modules/user/entity/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ArticleCommentIsDelete, ArticleTableName, ArticleCommentIsTop } from "../constants/entity.cfg";

/**
 * 文章业务 评论 实体
 */
@Entity({ name: ArticleTableName.COMMENT })
export class ArticleComment extends BaseInitEntity<{}> {
  /**
   * 评论ID
   */
  @PrimaryGeneratedColumn({
    comment: '评论ID',
  })
  id: number;

  /**
   * 评论用户ID
   */
  @ManyToOne(type => User, user => user.id)
  user_id: User['id'];

  /**
   * 评论内容
   */
  @Column({
    length: 150,
    nullable: false,
    comment: '评论内容'
  })
  content: string;

  /**
   * 点赞次数
   */
  @Column({
    name: 'love_num',
    comment: '点赞次数',
  })
  loveNum: number;

  /**
   * 点踩次数
   */
  @Column({
    name: 'criticism_num',
    comment: '点踩次数',
  })
  criticismNum: number;

  /**
   * 父级评论ID
   */
  @ManyToOne(type => ArticleComment, commit => commit.id)
  parent: ArticleComment['id'];

  /**
   * 是否被置顶
   */
  @Column({
    name: 'is_top',
    type: 'enum',
    enum: ArticleCommentIsTop,
    default: ArticleCommentIsTop.false,
    comment: '是否被置顶',
    select: false,
  })
  isTop: ArticleCommentIsTop;

  /**
   * 是否被删除
   */
  @Column({
    type: 'enum',
    enum: ArticleCommentIsDelete,
    default: ArticleCommentIsDelete.false,
    comment: '是否被删除',
    name: 'is_delete',
    select: false,
  })
  isDelete: ArticleCommentIsDelete;

  /**
   * 修改时间
   */
  @UpdateDateColumn({
    name: 'update_time',
    comment: '更新时间',
  })
  updateTime: Date;

  /**
   * 更新时间
   */
  @CreateDateColumn({
    name: 'create_time',
    comment: '更新时间',
    select: false,
  })
  createTime: Date;
}
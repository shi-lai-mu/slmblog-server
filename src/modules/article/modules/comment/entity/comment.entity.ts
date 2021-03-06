import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Article } from '../../../entity/article.entity'
import { UserEntity } from 'src/modules/user/entity/user.entity'

import { ArticleCommentNS } from '../type/comment'
import { BaseInitEntity } from 'src/entity/baseInitEntity'
import {
  ArticleCommentIsDelete,
  ArticleTableName,
  ArticleCommentIsTop,
} from '../../../constants/entity.cfg'

/**
 * 文章业务 评论 实体
 */
@Entity({ name: ArticleTableName.COMMENT })
export class ArticleComment extends BaseInitEntity<ArticleCommentNS.CreateArticleComment> {
  /**
   * 评论ID
   */
  @PrimaryGeneratedColumn({
    comment: '评论ID',
  })
  id: number

  /**
   * 文章ID
   */
  @JoinColumn({
    name: 'article_id',
  })
  @ManyToOne(article => Article, article => article.id)
  article: number

  /**
   * 评论内容
   */
  @Column({
    type: 'text',
    nullable: false,
    comment: '评论内容',
  })
  content: string

  /**
   * 点赞次数
   */
  @Column({
    name: 'love_num',
    default: 0,
    comment: '点赞次数',
  })
  loveNum: number

  /**
   * 点踩次数
   */
  @Column({
    name: 'criticism_num',
    default: 0,
    comment: '点踩次数',
  })
  criticismNum: number

  /**
   * 父级评论ID
   */
  @ManyToOne(type => ArticleComment, commit => commit.id)
  @JoinColumn({ name: 'parent_id' })
  parent?: ArticleComment['id']

  /**
   * 评论用户ID
   */
  @ManyToOne(user => UserEntity, user => user.id)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity['id']

  /**
   * 子评论数量
   */
  @Column({
    name: 'sub_comment_count',
    default: 0,
    comment: '子评论数量',
  })
  subCommentCount: number

  /**
   * 昵称
   */
  @Column({
    comment: '昵称',
  })
  nickname?: string

  /**
   * 网站/博客
   */
  @Column({
    comment: '网站/博客',
    default: '',
  })
  link?: string

  /**
   * 邮箱
   */
  @Column({
    comment: '邮箱',
    default: '',
  })
  email?: string

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
  isTop: ArticleCommentIsTop

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
  isDelete: ArticleCommentIsDelete

  /**
   * 修改时间
   */
  @UpdateDateColumn({
    name: 'update_time',
    comment: '更新时间',
  })
  updateTime: Date

  /**
   * 更新时间
   */
  @CreateDateColumn({
    name: 'create_time',
    comment: '更新时间',
    select: false,
  })
  createTime: Date

  /**
   * 当前用户点赞状态
   * 1： 赞
   * 2： 踩
   * 0： 未进行操作
   */
  likeStatus?: number
}

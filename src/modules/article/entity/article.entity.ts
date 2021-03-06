import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { UserEntity } from '../../user/entity/user.entity'
import { ArticleStat } from '../modules/comment/entity/stat.entity'

import { ARTICLE_CONSTANTS } from 'src/constants'
import { BaseInitEntity } from '../../../entity/baseInitEntity'
import { ArticleStateEnum, ArticleTableName } from 'src/modules/article/constants/entity.cfg'

/**
 * 文章实体
 */
@Entity({ name: ArticleTableName.ARTICLE })
export class Article extends BaseInitEntity<{}> {
  /** 文章ID */
  @PrimaryGeneratedColumn({
    comment: '文章ID',
  })
  id: number

  /** 作者 */
  @ManyToOne(() => UserEntity, user => user.id)
  author: UserEntity | UserEntity['id']

  /** 标题 */
  @Column({
    length: ARTICLE_CONSTANTS.TITLE_MAX_LENGTH,
    comment: '标题',
  })
  subject: string

  /** 头图 */
  @Column({
    comment: '头图',
  })
  banner: string

  /** 文章内容 */
  @Column({
    type: 'text',
    comment: '文章内容',
    select: false,
  })
  content: string

  /** 简介 */
  @Column({
    length: ARTICLE_CONSTANTS.DESC_MAX_LENGTH,
    comment: '简介',
  })
  description: string

  /** 文章标签 */
  @Column({
    length: ARTICLE_CONSTANTS.CATEGORY_MAX_LENGTH,
    comment: '文章标签',
  })
  category: string

  /** 文章状态 */
  @Column({
    type: 'enum',
    enum: ArticleStateEnum,
    default: ArticleStateEnum.examine,
    comment: '文章状态',
  })
  state: ArticleStateEnum

  /** 文章设置 */
  @Column({
    type: 'text',
    comment: '文章设置',
  })
  setting: string

  /** 评论数量 */
  @Column({
    name: 'comment_count',
    comment: '评论数量',
    default: 0,
  })
  commentCount: number

  /** 状态表ID */
  @ManyToOne(() => ArticleStat, stat => stat.id)
  stat: ArticleStat

  /** 最后编辑时间 */
  @UpdateDateColumn({
    name: 'edit_time',
    comment: '最后编辑时间',
    select: false,
  })
  lastEditorTime: Date

  /** 数据最后更新时间 */
  @UpdateDateColumn({
    name: 'update_time',
    comment: '数据最后更新时间',
  })
  updateTime: Date

  /** 创建时间 */
  @CreateDateColumn({
    name: 'create_time',
    comment: '创建时间',
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

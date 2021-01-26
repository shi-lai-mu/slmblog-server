import { ARTICLE_CONSTANTS } from 'src/constants/constants';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { BaseInitEntity } from './baseInitEntity';
import { User } from './user.entity';
import { Exclude } from 'class-transformer';


/**
 * 文章状态
 */
export enum ArticleStateEnum {
  Failed   = -2, // 审核未通过
  IsDelete = -1, // 已删除
  Examine  = 0,  // 审核中
  Routine  = 1,  // 常规
  Topping  = 2,  // 置顶文章
  Boutique = 3,  // 精品文章
}

/**
 * 点赞状态
 */
export enum ArticleLikeStatus {
  NotLike  = 0, // 未点赞
  Approved = 1, // 已点赞
}

/**
 * 文章审核状态
 */
export enum ArticleAuditEnum {
  NotReviewed = 0,  // 正在审核
  Approved    = 1,  // 审核通过
  Failed      = -1, // 审核未通过
}

/**
 * 用户权限
 */
export enum UserRole {
  Normal     = 1, // 普通用户
  BlogUser   = 2, // 博主用户
  Editor     = 3, // 网站编辑
  Admin      = 4, // 管理员
  SuperAdmin = 5, // 超级管理员
}

/**
 * 账号状态
 */
export enum UserStatus {
  InActive = 1, // 未激活
  Actived  = 2, // 已激活
  Frozen   = 3, // 已冻结
}


/**
 * 性别
 */
export enum UserGender {
  Male    = 0, // 男
  Female  = 1, // 女
  Unknown = 2, // 未知
}


/**
 * 校验策略类型
 */
export enum ValidateType {
 jwt   = 'jwt',   // token
 local = 'local', // account
}


const { tablePerfix } = BaseInitEntity.dbConfig;
/**
 * 文章实体表名
 */
export const ArticleTableName = {
  ARTICLE: tablePerfix + 'article',
  LIKE:    tablePerfix + 'article_like',
  STAT:    tablePerfix + 'article_stat',
};


/**
 * 文章状态实体
 */
@Entity({ name: ArticleTableName.STAT })
export class ArticleStat extends BaseInitEntity<{}> {
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


/**
 * 文章实体
 */
@Entity({ name: ArticleTableName.ARTICLE })
export class Article extends BaseInitEntity<{}> {
  /**
   * 文章ID
   */
  @PrimaryGeneratedColumn({ comment: '文章ID' })
  id: number;
  /**
   * 作者
   */
  @ManyToOne(type => User, user => user.id)
  author: User | User['id'];
  /**
   * 标题
   */
  @Column({ length: ARTICLE_CONSTANTS.TITLE_MAX_LENGTH, comment: '标题' })
  subject: string;
  /**
   * 头图
   */
  @Column({  comment: '头图' })
  banner: string;
  /**
   * 文章内容
   */
  @Column({ type: 'text', comment: '文章内容' })
  content: string;
  /**
   * 简介
   */
  @Column({ length: ARTICLE_CONSTANTS.DESC_MAX_LENGTH, comment: '简介' })
  description: string;
  /**
   * 文章标签
   */
  @Column({ length: ARTICLE_CONSTANTS.CATEGORY_MAX_LENGTH, comment: '文章标签' })
  category: string;
  /**
   * 文章状态
   */
  @Column({ type: 'enum', enum: ArticleStateEnum, default: ArticleStateEnum.Routine, comment: '文章状态' })
  state: ArticleStateEnum;
  /**
   * 文章设置
   */
  @Column({ type: 'text', comment: '文章设置' })
  setting: string;
  /**
   * 状态表ID
   */
  @ManyToOne(type => ArticleStat, stat => stat.id)
  stat: ArticleStat;
  /**
   * 最后编辑时间
   */
  @UpdateDateColumn({ name: 'edit_time', comment: '最后编辑时间' })
  lastEditorTime: Date;
  /**
   * 数据最后更新时间
   */
  @UpdateDateColumn({ name: 'update_time', comment: '数据最后更新时间' })
  updateTime: Date;
  /**
   * 创建时间
   */
  @CreateDateColumn({ name: 'create_time', comment: '创建时间' })
  createTime: Date;
  /**
   * 文章审核状态
   */
  @Column({ type: 'enum', enum: ArticleAuditEnum, default: ArticleAuditEnum.NotReviewed, comment: '文章审核状态' })
  audit: ArticleAuditEnum;
}



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


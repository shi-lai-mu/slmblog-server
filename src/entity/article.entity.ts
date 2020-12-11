import { ARTICLE_CONSTANTS } from 'src/constants/constants';
import { UserServiceNS } from 'src/interface/user.interface';
import { Column, CreateDateColumn, Entity, Generated, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { BaseInitEntity } from './baseInitEntity';
import { User } from './user.entity';



/**
 * 文章删除状态
 */
export enum ArticleStateEnum {
  Failed   = -2, // 审核失败
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
 * 文章实体
 */
const articleTableName = BaseInitEntity.dbConfig.tablePerfix + 'article';
@Entity({ name: articleTableName })
export class Article extends BaseInitEntity<{}> {

  @PrimaryGeneratedColumn({ comment: '文章ID' })
  id: number;

  // 作者ID
  @ManyToOne(type => User, user => user.id)
  author: User['id'];

  @Column({ length: ARTICLE_CONSTANTS.TITLE_MAX_LENGTH, comment: '标题' })
  title: string;
  
  @Column({  comment: '头图' })
  firstPicture: string;

  @Column({ type: 'text', comment: '文章内容' })
  content: string;

  @Column({ length: ARTICLE_CONSTANTS.DESC_MAX_LENGTH, comment: '简介' })
  description: string;

  @Column({ length: ARTICLE_CONSTANTS.CATEGORY_MAX_LENGTH, comment: '文章标签' })
  category: string;

  @Column({ type: 'enum', enum: ArticleStateEnum, default: ArticleStateEnum.Routine, comment: '文章状态' })
  state: ArticleStateEnum;

  @Column({ name: 'view_count', comment: '浏览次数' })
  viewCount: number;

  @Column({ name: 'like_count', comment: '点赞次数' })
  likeCount: number;

  @Column({ name: 'read_password', comment: '阅读密码' })
  readPassword: string;

  @UpdateDateColumn({ name: 'edit_time', comment: '最后编辑时间' })
  lastEditorTime: Date;

  @UpdateDateColumn({ name: 'update_time', comment: '数据最后更新时间' })
  updateTime: Date;

  @CreateDateColumn({ name: 'create_time', comment: '创建时间' })
  createTime: Date;

  @Column({ type: 'enum', enum: ArticleAuditEnum, default: ArticleAuditEnum.NotReviewed, comment: '文章审核状态' })
  audit: ArticleAuditEnum;
}



/**
 * 点赞实体
 */
@Entity({ name: articleTableName + '_like' })
export class ArticleLike extends BaseInitEntity<{}> {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => User, user => user.id)
  user: number;
  
  @ManyToOne(type => Article, article => article.id)
  article: number;

  @Column({ type: 'enum', enum: ArticleLikeStatus, default: ArticleLikeStatus.Approved, comment: '点赞状态' })
  status: ArticleLikeStatus;

  @CreateDateColumn({ name: 'create_time', comment:  '点赞时间' })
  createTime: Date;
}
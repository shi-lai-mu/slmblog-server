import { UserServiceNS } from 'src/interface/user.interface';
import { Column, CreateDateColumn, Entity, Generated, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { BaseInitEntity } from './baseInitEntity';
import { Exclude } from 'class-transformer';
import { USER_CONSTANTS } from 'src/constants/constants';

/**
 * 用户权限
 */
export enum UserRole {
  Normal     = 1,  // 普通用户
  BlogUser   = 2,  // 博主用户
  Editor     = 3,  // 网站编辑
  Admin      = 4,  // 管理员
  SuperAdmin = 5,  // 超级管理员
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
 * 用户实体
 */
@Entity({ name: BaseInitEntity.dbConfig.tablePerfix + 'users' })
export class User extends BaseInitEntity<UserServiceNS.CreateUser> {

  @PrimaryGeneratedColumn({ comment: '用户ID' })
  id: number;

  @Column({ length: USER_CONSTANTS.ACCOUNT_MAX_LENGTH, unique: true, comment: '账号' })
  account: string;

  @Column({ length: USER_CONSTANTS.NICKNAME_MAX_LENGTH, comment: '昵称' })
  nickname: string;

  @Column({ name: 'avatar_url', length: USER_CONSTANTS.AVATARURL_MAX_LENGTH, default: '', comment: '头像' })
  avatarUrl: string;

  @Exclude()
  @Column({ length: 100, comment: '密码' })
  password: string;

  @Column({ type: 'enum', enum: UserGender, default: UserGender.Unknown, comment: '性别' })
  gender: UserGender;

  // @Column({ length: 100, unique: true, comment: '身份令牌' })
  // @Generated('uuid')
  // token: string;

  @Exclude()
  @Column({ length: 7, comment: '用户唯一盐' })
  iv: string;

  @Exclude()
  @Column({ length: 20, comment: '最后登录IP' })
  ip: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.Normal, comment: '权限' })
  role: UserRole;

  @Column({ name: 'system_platform', length: 50, comment: '常用设备系统' })
  systemPlatform: string;

  @UpdateDateColumn({ name: 'update_time', comment: '数据修改时间' })
  updateTime: Date;

  @CreateDateColumn({ name: 'create_time', comment: '账号注册时间' })
  createTime: Date;

  @Column({ name: 'link_json', length: USER_CONSTANTS.LINKJSON_MAX_LENGTH, default: '', comment: '个人链接' })
  link: string;

  @Column({ length: USER_CONSTANTS.DESC_MAX_LENGTH, default: '', comment: '简介' })
  introduction: string;

  @Exclude()
  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.Actived, comment: '账号状态' })
  status: UserStatus;

  // 徽章关联
  @ManyToOne(type => Badge, badge => badge.id)
  badge: Badge[];

  validateType?: 'jwt' | 'local';
}

@Entity({ name: 'user_badge' })
export class Badge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: USER_CONSTANTS.BADGE_NAME_MAX_LENGTH, comment: '名称' })
  name: string;

  @Column({ length: USER_CONSTANTS.BADGE_ICON_MAX_LENGTH, comment: '图标' })
  icon: string;

  @Column({ length: USER_CONSTANTS.BADEG_DESC_MAX_LENGTH, comment: '简介' })
  description: string;

  @OneToMany(ts => User, user => user.id)
  owner: User[];
}

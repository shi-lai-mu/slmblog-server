import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { BaseInitEntity } from './baseInitEntity';
import { USER_CONSTANTS } from 'src/constants/constants';
import { UserServiceNS } from 'src/modules/user/type/user';

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
 * 用户实体表名
 */
export const UserTableName = {
  USER:   tablePerfix + 'users',        // 用户表
  BADGE:  tablePerfix + 'user_badge',   // 用户徽章表
  CONFIG: tablePerfix + 'user_config',  // 用户配置表
}

/**
 * 用户实体
 */
@Entity({ name: UserTableName.USER })
export class User extends BaseInitEntity<UserServiceNS.CreateUser> {

  /**
   * 用户ID
   */
  @PrimaryGeneratedColumn({ comment: '用户ID' })
  id: number;

  /**
   * 账号
   */
  @Column({ length: USER_CONSTANTS.ACCOUNT_MAX_LENGTH, unique: true, comment: '账号' })
  @Exclude()
  account: string;

  /**
   * 昵称
   */
  @Column({ length: USER_CONSTANTS.NICKNAME_MAX_LENGTH, comment: '昵称' })
  nickname: string;

  /**
   * 头像
   */
  @Column({ name: 'avatar_url', length: USER_CONSTANTS.AVATARURL_MAX_LENGTH, default: '', comment: '头像' })
  avatarUrl: string;

  /**
   * 密码
   */
  @Column({
    length: 100,
    select: false,
    comment: '密码',
  })
  @Exclude()
  password: string;

  /**
   * 性别
   */
  @Column({
    type: 'enum',
    enum: UserGender,
    default: UserGender.Unknown,
    comment: '性别',
    select: false,
  })
  gender: UserGender;

  // @Column({ length: 100, unique: true, comment: '身份令牌' })
  // @Generated('uuid')
  // token: string;

  /**
   * 用户唯一盐
   */
  @Column({
    length: 7,
    comment: '用户唯一盐',
    select: false,
  })
  @Exclude()
  iv: string;

  /**
   * 最后登录IP
   */
  @Column({
    length: 20,
    comment: '最后登录IP',
    select: false,
  })
  @Exclude()
  ip: string;

  /**
   * 权限
   */
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.Normal,
    comment: '权限',
  })
  role: UserRole;

  /**
   * 常用设备系统
   */
  @Column({
    name: 'system_platform',
    length: 50,
    comment: '常用设备系统',
    select: false,
  })
  @Exclude()
  systemPlatform: string;

  /**
   * 数据修改时间
   */
  @UpdateDateColumn({
    name: 'update_time',
    comment: '数据修改时间',
    select: false,
  })
  updateTime: Date;

  /**
   * 账号注册时间
   */
  @CreateDateColumn({
    name: 'create_time',
    comment: '账号注册时间',
    select: false,
  })
  createTime: Date;

  /**
   * 个人链接
   */
  @Column({
    name: 'link_json',
    length: USER_CONSTANTS.LINKJSON_MAX_LENGTH,
    default: '',
    comment: '个人链接',
    select: false,
  })
  link: string;

  /**
   * 简介
   */
  @Column({
    length: USER_CONSTANTS.DESC_MAX_LENGTH,
    default: '',
    comment: '简介',
    select: false,
  })
  introduction: string;

  /**
   * 账号状态
   */
  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.Actived,
    comment: '账号状态',
    select: false,
  })
  status: UserStatus;

  /**
   * 徽章关联
   */
  @ManyToOne(type => Badge, badge => badge.id)
  badge: Badge[];

  /**
   * 用户配置
   */
  @ManyToOne(type => UserConfigEntity, config => config.id)
  config: number;

  /**
   * 校验策略
   */
  validateType?: keyof typeof ValidateType;
}

console.log(new User());

/**
 * 徽章实体
 */
@Entity({ name: UserTableName.BADGE })
export class Badge {
  /**
   * ID
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 名称
   */
  @Column({ length: USER_CONSTANTS.BADGE_NAME_MAX_LENGTH, comment: '名称' })
  name: string;

  /**
   * 图标
   */
  @Column({ length: USER_CONSTANTS.BADGE_ICON_MAX_LENGTH, comment: '图标' })
  icon: string;

  /**
   * 简介
   */
  @Column({ length: USER_CONSTANTS.BADEG_DESC_MAX_LENGTH, comment: '简介' })
  description: string;

  /**
   * 拥有者
   */
  @OneToMany(ts => User, user => user.id)
  owner: User[];
}


/**
 * 用户配置实体
 */
@Entity({ name: UserTableName.CONFIG })
export class UserConfigEntity {
  /**
   * ID
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 用户ID
   */
  @ManyToOne(type => User, user => user.id)
  user: number;

  /**
   * 配置内容(JSON)
   */
  @Column({ type: 'text', comment: '配置内容(JSON)' })
  json: string;
}
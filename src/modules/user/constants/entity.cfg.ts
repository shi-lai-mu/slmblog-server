import { BaseInitEntity } from 'src/entity/baseInitEntity'

const { tablePerfix } = BaseInitEntity.dbConfig
/** 用户实体表名 */
export const UserTableName = {
  /** 用户表 */
  USER: tablePerfix + 'users',
  /** 用户徽章表 */
  BADGE: tablePerfix + 'user_badge',
  /** 用户配置表 */
  CONFIG: tablePerfix + 'user_config',
}

/** 用户权限 */
export enum Permission {
  /** 游客 */
  Tourist = '0',
  /** 普通用户 */
  Normal = '1',
  /** 博主用户 */
  BlogUser = '2',
  /** 网站编辑 */
  Editor = '3',
  /** 管理员 */
  Admin = '4',
  /** 超级管理员 */
  SuperAdmin = '5',
}

/** 账号状态 */
export enum UserStatus {
  /** 已冻结 */
  Frozen = -1,
  /** 游客 */
  Tourist = 0,
  /** 未激活 */
  InActive = 1,
  /** 已激活 */
  Actived = 2,
}

/** 性别 */
export enum UserGender {
  /** 男 */
  Male = 0,
  /** 女 */
  Female = 1,
  /** 未知 */
  Unknown = 2,
}

/** 校验策略类型 */
export enum ValidateType {
  /** token */
  jwt = 'jwt',
  /** account */
  local = 'local',
}

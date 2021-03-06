import { BaseInitEntity } from "src/entity/baseInitEntity";

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
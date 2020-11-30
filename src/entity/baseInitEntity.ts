import { BaseEntity } from "typeorm";

/**
 * 初始化实体基类 基础 typeorm BaseEntity ActiveRecord
 */
export class BaseInitEntity<T> extends BaseEntity {
  constructor(data?: T) {
    super();
    data && Object.keys(data).forEach(k => this[k] = data[k]);
  }
}
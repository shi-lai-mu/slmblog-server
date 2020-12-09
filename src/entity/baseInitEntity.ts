import ConfigsService from "src/configs/configs.service";
import { BaseEntity } from "typeorm";

const configsService = new ConfigsService();

/**
 * 初始化实体基类 基础 typeorm BaseEntity ActiveRecord
 */
export class BaseInitEntity<T> extends BaseEntity {
  
  static readonly dbConfig: ConfigsService['db'] = configsService.db;

  constructor(data?: T) {
    super();
    data && Object.keys(data).forEach(k => this[k] = data[k]);
  }
}
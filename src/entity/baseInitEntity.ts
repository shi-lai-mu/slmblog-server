import ConfigsService from "src/modules/coreModules/config/configs.service";
import { BaseEntity } from "typeorm";

const configsService = new ConfigsService();

/**
 * 初始化实体基类 基础 typeorm BaseEntity ActiveRecord
 */
export class BaseInitEntity<T> extends BaseEntity {
  
  /**
   * 当前环境数据库配置信息
   */
  static readonly dbConfig: ConfigsService['db'] = configsService.db;

  constructor(data?: T) {
    super();
    data && Object.keys(data).forEach(k => this[k] = data[k]);
  }
}
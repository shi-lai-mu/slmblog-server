import { BaseEntity } from 'typeorm'
import { DBConfig } from 'src/configs/type/db.cfg'

/**
 * 初始化实体基类 基础 typeorm BaseEntity ActiveRecord
 */
export class BaseInitEntity<T> extends BaseEntity {
  /**
   * 当前环境数据库配置信息
   */
  static get dbConfig() {
    return new DBConfig()
  }

  constructor(data?: T) {
    super()
    data && Object.keys(data).forEach(k => (this[k] = data[k]))
  }
}

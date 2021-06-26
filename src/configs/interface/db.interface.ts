import { RedisOptions } from 'ioredis'
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions'

/**
 * 数据库 配置
 */
export interface DBConfig extends MysqlConnectionOptions {
  tablePerfix: string
}

/**
 * Redis 配置
 */
export type RedisConfig = RedisOptions

/**
 * 局部数据库 配置
 */
export interface LocalDBconfig {
  db: DBConfig
}

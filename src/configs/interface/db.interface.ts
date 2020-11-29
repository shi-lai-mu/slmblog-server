import { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions";
import { RedisOptions } from 'ioredis';

/**
 * 数据库 配置
 */
export interface DBConfig extends MysqlConnectionOptions {}

export interface RedisConfig extends RedisOptions {}

/**
 * 局部数据库 配置
 */
export interface LocalDBconfig {
  db: DBConfig;
}
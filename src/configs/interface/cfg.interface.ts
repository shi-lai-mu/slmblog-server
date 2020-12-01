import { JwtModuleOptions } from "@nestjs/jwt";
import { DBConfig, RedisConfig } from "./db.interface";

/**
 * 标准配置文件
 */
export interface StandardConfig {
  /**
   * 数据库 配置
   */
  db: DBConfig;
  /**
   * Redis 配置
   */
  redis: RedisConfig;
  /**
   * jwt 配置
   */
  jwt: JwtModuleOptions;
}
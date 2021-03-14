import { JwtModuleOptions } from "@nestjs/jwt";
import { MailerOptions } from "@nestjs-modules/mailer";

import { DBConfig, RedisConfig } from "./db.interface";



/**
 * 标准配置文件
 */
export interface StandardConfig {
  /**
   * 站点设置
   */
  web: {
    /**
     * 域名
     */
    host: string;
    /**
     * 邮箱业务配置
     */
    email: {
      /**
       * 提供支持的邮箱
       */
      support: string;
      /**
       * 发送业务的邮箱
       */
      from: {
        /**
         * 显示名称
         */
        name: string;
        /**
         * 邮箱号
         */
        address: string;
      },
    },
  },
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
  /**
   * 邮箱配置
   */
  email: MailerOptions;
}
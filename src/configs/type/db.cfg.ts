import { DbLogger } from 'src/plugins/log4'

/**
 * 数据库配置
 */
export class DBConfig {
  /** 数据库类型。您必须指定您使用的数据库引擎 */
  readonly type: DBType.Type = process.env.DB_TYPE as DBType.Type

  /** 数据库主机 */
  readonly host: string = process.env.DB_HOST

  /** 数据库主机端口。默认 mysql 端口是3306数据库主机端口。默认 mysql 端口是3306 */
  readonly port: number = Number(process.env.DB_PROT) || 3306

  /** 数据库用户名 */
  readonly username: string = process.env.DB_USERNAME

  /** 数据库密码 */
  readonly password: string = process.env.DB_PASSWORD

  /** 连接的字符集。这在 MySQL 的 SQL 级别中称为“排序规则”（如 utf8_general_ci）。如果指定了 SQL 级别的字符集（如 utf8mb4），则使用该字符集的默认排序规则。（默认：UTF8_GENERAL_CI) */

  readonly charset: string = process.env.DB_CHARSET || 'UTF8_GENERAL_CI'

  /** MySQL 服务器上配置的时区。这用于将服务器日期/时间值类型转换为 JavaScript 日期对象，反之亦然。这可以是local, Z, 或形式为+HH:MMor的偏移量 -HH:MM。（默认值：local） */
  readonly timezone: string = process.env.DB_TIMEZONE || 'local'

  /** 数据库名称 */
  readonly database: string = process.env.DB_DATABASE

  /** 要为此连接加载和使用的实体或实体模式。接受要从中加载的实体类、实体架构类和目录路径。目录支持全局模式 */
  readonly entities: string[] = [process.env.DB_ENTITIES]

  /**
   * 如果true，自动加载的模型将被同步（默认值：true）
   * TODO: true不应在生产中使用设置- 否则您可能会丢失生产数据
   */
  readonly synchronize: boolean = Boolean(process.env.DB_SYNCHRONIZE)

  /**
   * 指示是否启用日志记录。如果设置为true则将启用查询和错误日志记录。您还可以指定要启用的不同类型的日志记录，例如["query", "error", "schema"]
   * @see https://typeorm.io/#/logging/
   */
  readonly logging: boolean = Boolean(process.env.DB_LOGGING)

  /** 尝试连接到数据库的次数（默认值：10） */
  readonly retryAttempts: number = Number(process.env.DB_RETRY_ATTEMPTS) || 10

  /** 连接重试之间的延迟（ms）（默认值：3000） */
  readonly retryDelay: number = Number(process.env.DB_RETRY_DELAY) || 3000

  /**
   * 用于记录目的的记录器。可能的值为“高级控制台”、“简单控制台”和“文件”。默认为“高级控制台”。您还可以指定一个实现Logger接口的记录器类
   * @see https://typeorm.io/#/logging/
   */
  readonly logger: DBType.Logger | DbLogger =
    (process.env.DB_LOGGER as unknown as DBType.Logger) || new DbLogger()

  /** 如果查询执行时间超过此给定的最大执行时间（以毫秒为单位），则记录器将记录此查询。 */
  readonly maxQueryExecutionTime: number = Number(process.env.MAX_QUERY_EXECUTION_TIME) || 1000000

  /** 此数据库连接上的所有表（或集合）都带有给定字符串的前缀。 */
  readonly tablePerfix: string = process.env.DB_TABLEFIX || 'blog_'

  /**
   * 启用实体结果缓存。您还可以在此处配置缓存类型和其他缓存选项
   * @see https://typeorm.io/#/caching/
   */
  readonly cache: DBType.Cache = Boolean(process.env.DB_CACHE)
    ? {
        /** 缓存类型 */
        type: process.env.DB_CACHE_TYPE,
        options: {
          /** Redis服务器的IP地址 */
          host: process.env.DB_CACHE_REDIS_HOST,

          /** Redis服务器端口 */
          port: Number(process.env.DB_CACHE_REDIS_PORT) || 6379,

          /** 如果您将系列设置为“IPv6”，则可以强制使用 IPv6。请参阅 Node.js net或dns模块以了解如何使用系列类型。 */
          family: Number(process.env.DB_CACHE_REDIS_FAMILY) || 0,

          /** 如果设置，客户端将在连接时运行 Redis auth 命令。别名auth_pass 注意节点Redis < 2.5 必须使用auth_pass */
          password: process.env.DB_CACHE_REDIS_PASSWORD,

          /** 如果设置，客户端将select在连接时运行 Redis命令。 */
          db: Number(process.env.DB_CACHE_REDIS_DB) || 0,
        },
      }
    : false

  /** 将协议详细信息打印到标准输出。可以是 true/false 或应打印的数据包类型名称数组。（默认值：false） */
  readonly debug: boolean = Boolean(process.env.DB_DEBUG)
}

/**
 * 数据库配置
 */
export class RedisConfig {
  /** Redis服务器的IP地址 */
  readonly host: string = process.env.REDIS_HOST

  /** Redis服务器端口 */
  readonly port: number = Number(process.env.REDIS_PORT) || 6379

  /** 前缀 */
  readonly keyPrefix: string = process.env.REDIS_KEYFIX

  /** 如果您将系列设置为“IPv6”，则可以强制使用 IPv6。请参阅 Node.js net或dns模块以了解如何使用系列类型。 */
  readonly family: number = Number(process.env.REDIS_FAMILY) || 0

  /** 如果设置，客户端将在连接时运行 Redis auth 命令。别名auth_pass 注意节点Redis < 2.5 必须使用auth_pass */
  readonly password: string = process.env.REDIS_PASSWORD

  /** 如果设置，客户端将select在连接时运行 Redis命令。 */
  readonly db: number = Number(process.env.REDIS_DB) || 0
}

export namespace DBType {
  export type Type =
    | 'mysql'
    | 'postgres'
    | 'cockroachdb'
    | 'mariadb'
    | 'sqlite'
    | 'better-sqlite3'
    | 'capacitor'
    | 'cordova'
    | 'nativescript'
    | 'oracle'
    | 'mssql'
    | 'mongodb'

  export type Logger = 'advanced-console' | 'simple-console' | 'file' | 'debug'

  export type Cache =
    | false
    | {
        type: any
        options: {
          host: string
          port: number
          family: number
          password: string
          db: number
        }
      }
}

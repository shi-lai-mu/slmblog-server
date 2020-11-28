import { BaseConfig } from '../base.service';

/**
 * 数据库配置
 */
export default class DBConfig extends BaseConfig {
  readonly type: 'mysql' | 'mariadb';
  readonly host: string;
  readonly port: number;
  readonly username: string;
  readonly password: string;
  readonly database: string;
  readonly entities: string[];
  readonly synchronize: boolean;
  readonly logging: any;
  readonly retryAttempts: number;
  readonly logger: 'advanced-console' | 'simple-console' | 'file' | 'debug' | any;

  constructor(cfg) {
    super(cfg);
  }
}
import * as fs from 'fs';
import * as path from 'path';
import { defaultsDeep } from 'lodash';
import { JwtModuleOptions } from '@nestjs/jwt';
import { MailerOptions } from '@nestjs-modules/mailer';

import DefaultCfg from '../../../configs/default.cfg';
import { DBConfig, RedisConfig } from '../../../configs/type/db.cfg';
import { StandardConfig } from 'src/configs/interface/cfg.interface';



/**
 * 核心 配置业务 逻辑层
 */
export default class ConfigsService {

  /**
   * 站点配置
   */
  readonly web: StandardConfig['web'];
  /**
   * 数据库 配置
   */
  readonly db: DBConfig;
  /**
   * Redis 配置
   */
  readonly redis: RedisConfig;
  /**
   * jwt 配置
   */
  readonly jwt: JwtModuleOptions;
  /**
   * 邮箱配置
   */
  readonly email: MailerOptions;

  constructor() {
    let cfg = DefaultCfg;
    
    // 本地env内配置引入
    ['default', 'dev', ].forEach(cfgModel => {
      const cfgPath = path.join(path.resolve(), 'src', 'configs', 'env', cfgModel + '.cfg.ts');
      if (fs.existsSync(cfgPath)) {
        cfg = defaultsDeep(require(cfgPath), cfg);
      }
    });

    // 载入配置
    this.db = new DBConfig(cfg.db);
    this.redis = new RedisConfig(cfg.redis);
    this.jwt = cfg.jwt;
    this.email = cfg.email;
    this.web = cfg.web;
  }
}

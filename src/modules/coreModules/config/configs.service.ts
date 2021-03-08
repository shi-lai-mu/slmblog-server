import * as fs from 'fs';
import * as path from 'path';
import { defaultsDeep } from 'lodash';
import { JwtModuleOptions } from '@nestjs/jwt';

import DefaultCfg from '../../../configs/default.cfg';
import { DBConfig, RedisConfig } from '../../../configs/type/db.cfg';



/**
 * 核心 配置业务 逻辑层
 */
export default class ConfigsService {
  
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
  }
}

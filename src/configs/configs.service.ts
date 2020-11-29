import { isDev } from 'src/constants/system';
import * as fs from 'fs';
import * as path from 'path';
import { DBConfig, RedisConfig } from './type/db.cfg';
import DefaultCfg from './default.cfg';
import { defaultsDeep } from 'lodash';

/**
 * 配置逻辑层
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
  }
}

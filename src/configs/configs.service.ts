import { isDev } from 'src/constants/system';
import * as fs from 'fs';
import * as path from 'path';
import DBConfig from './type/db.cfg';
import DefaultCfg from './default.cfg';
import * as _ from 'lodash';


export default class ConfigsService {
  
  readonly db: DBConfig;

  constructor() {
    let cfg = DefaultCfg;
    
    // 本地env内配置引入
    ['default', 'dev', ].forEach(cfgModel => {
      const cfgPath = path.join(path.resolve(), 'src', 'configs', 'env', cfgModel + '.cfg.ts');
      if (fs.existsSync(cfgPath)) {
        cfg = _.defaultsDeep(require(cfgPath), cfg);
      }
    });

    this.db = new DBConfig(cfg.db);
  }

}

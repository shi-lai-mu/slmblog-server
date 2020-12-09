import { fromPairs } from 'lodash';
import { isProd } from 'src/constants/system';
import { StandardConfig } from './interface/cfg.interface';
import * as path from 'path';

export default ((): StandardConfig => ({
  db: {
    type: 'mysql',
    host: '',
    port: 3306,
    charset: 'utf8mb4',
    username: '',
    password: '',
    database: `blog${isProd ? '' : '_test'}`,
    timezone: 'UTC',
    synchronize: !isProd,
    entities: [ path.join(__dirname, '../entity/**/*.entity{.ts,.js}') ] ,
    logging: false,
    logger: 'simple-console',
    maxQueryExecutionTime: 500,
    tablePerfix: 'blog_',
  },
  redis: {
    host: '127.0.0.1',
    port: 6379,
    keyPrefix: `blog${isProd ? '' : '_test'}:`,
    family: 4,
    password: '',
    db: 0,
  },
  jwt: {
    secret: '',
    signOptions: {
      expiresIn: '7d',
    },
  }
}))();
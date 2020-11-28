import * as path from 'path';

export default {
  db: {
    type: 'mysql',
    host: '',
    port: 3306,
    charset: 'utf8mb4',
    username: '',
    password: '',
    database: '',
    synchronize: false,
    entities: [ path.join(__dirname, '../entity/**/*.entity{.ts,.js}')] ,
    logging: 'all',
    logger: 'simple-console',
    maxQueryExecutionTime: 500,
    retryAttempts: 5,
  },
}
import { Injectable, NotImplementedException } from '@nestjs/common';
import * as Redis from 'ioredis';
import ConfigsService from 'src/configs/configs.service';
import { RedisConfig } from 'src/configs/type/db.cfg';

/**
 * 缓存键定义
 */
enum CacheKeys {
  user = 'user:%d',
  guards = 'guards:%d',
}

// 实例缓存
let RedisCache: { config?: RedisConfig, object?: Redis.Redis } = {
  config: null,
  object: null,
};

/**
 * Redis逻辑层
 */
@Injectable()
export class RedisService {
  readonly client: Redis.Redis;

  constructor(
    private readonly configService: ConfigsService,
  ) {
    if (JSON.stringify(RedisCache.config) === JSON.stringify(this.configService.redis)) {
      this.client = RedisCache.object;
    } else {
      this.client = new Redis(this.configService.redis);
    }
    RedisCache.config = this.configService.redis;
    RedisCache.object = this.client;
  }

  /**
   * 设置业务缓存
   * @param business   业务类型 
   * @param key        缓存键
   * @param data       数据
   * @param expiryMode 过期策略
   * @param time       过期时间
   */
  async setItem(
    business: keyof typeof CacheKeys,
    key: string,
    data: Redis.ValueType | Object,
    expiryMode: 'EX' | string | any[] = 'EX',
    time: string | number = 60 * 60,
  ) {
    const cacheKey = CacheKeys[business].replace('%d', key);
    return await this.client.set(
      cacheKey,
      typeof data === 'object' ? JSON.stringify(data) : data,
      expiryMode,
      time,
    );
  }


  /**
   * 获取业务缓存
   * @param business 业务类型 
   * @param key      缓存键
   */
  async getItem<T>(business: keyof typeof CacheKeys, key: string): Promise<T> {
    const cacheKey = CacheKeys[business].replace('%d', key);
    let FindCache: unknown = await this.client.get(cacheKey);
    if (FindCache && FindCache[0] === '{') FindCache = JSON.parse(<string>FindCache); 
    return <T>FindCache;
  }
}
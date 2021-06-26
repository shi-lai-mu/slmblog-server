/**
 * 配置基类
 */
export class BaseConfig {
  constructor(cfg) {
    Object.keys(cfg).forEach(k => (this[k] = cfg[k]))
  }
}

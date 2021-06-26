/** @file Environment / ES module * @module System * @author shi-lai-mu <https://github.com/surmon-china> */

const { env } = process
const { NODE_ENV } = env

/** 为开发环境 */
export const isDev = NODE_ENV === 'development'

/** 为生产环境 */
export const isProd = NODE_ENV === 'production'

/** 为Mock环境 */
export const isMock = !!env.npm_config_mock

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'

import { generateHash } from 'src/utils/crypto'
import { getClientIP } from 'src/utils/collection'
import { ResponseBody, Status } from 'src/constants/response'
import { ResBaseException } from 'src/core/exception/res.exception'

import { RedisService } from 'src/modules/coreModules/redis/redis.service'
import ConfigsService from 'src/modules/coreModules/config/configs.service'

const Redis = new RedisService(new ConfigsService())

/**
 * 频繁请求守卫
 */
export const FrequentlyGuards = (options: FrequentlyOptions): FrequentlyGuardsActivate => {
  options = Object.assign(
    {
      count: 1,
      expire: options.interval || 60,
      identificationHeaders: ['user-agent', 'referer', 'ip'],
    },
    options
  )

  @Injectable()
  class FrequentlyGuardsActivate implements CanActivate {
    async canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest()
      const { headers } = request
      const { identificationHeaders } = options
      let authStr = ''

      // 标识头部
      if (identificationHeaders) {
        identificationHeaders.forEach(ident => {
          if (ident === 'ip') headers[ident] = getClientIP(request)
          if (headers[ident]) authStr += String(headers[ident])
        })
        // console.log(us);
      }

      const hash = generateHash(authStr + request.url)
      const storeData = {
        t: Date.now() + 1000 * options.interval,
        c: 1,
      }

      const findHistory = await Redis.getItem<typeof storeData>('guards', hash)

      if (findHistory) {
        if (findHistory.c + 1 >= options.count && findHistory.t > Date.now()) {
          let status = ResponseBody.status('FREQUENTLY')
          if (options.message)
            typeof options.message === 'string'
              ? (status.message = options.message)
              : (status = options.message)
          ResponseBody.throw(status)
        }
      }

      await Redis.setItem(
        'guards',
        hash,
        storeData,
        'EX',
        options.interval < 1 ? 1 : options.interval
      )
      return true
    }
  }
  return FrequentlyGuardsActivate as any
}

class FrequentlyGuardsActivate implements CanActivate {
  canActivate = () => true
}

export interface FrequentlyOptions {
  /** 多少秒内 */
  interval: number
  /** 请求几次 */
  count?: number
  /** 封禁请求多少秒 */
  expire?: number
  /** 标识头部 [根据请求头部的哪几个字段判断用户身份] */
  identificationHeaders?: Array<string | number>
  /** 鉴权头部 [头部必须和传入内容相同] */
  authHeaders?: [{ [key: string]: any }]
  /** 频繁提示内容 */
  message?: Status | string
}

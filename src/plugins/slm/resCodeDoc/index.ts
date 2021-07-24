import * as fs from 'fs'
import * as path from 'path'
import Handlebars from 'handlebars'
import { ResponseDocument } from './type'
import { INestApplication } from '@nestjs/common'
import { Status } from 'src/constants/response'

const _dir = (name: string) => path.join(__dirname, name)
const fileStyle = fs.readFileSync(_dir('template/style.css').replace('src', '')).toString()
const fileContent = fs.readFileSync(_dir('template/index.hbs').replace('src', '')).toString()
const fileBusinessContent = fs
  .readFileSync(_dir('template/business.hbs').replace('src', ''))
  .toString()

/**
 * Response Document 文档 validation 全局注入
 */
export function createResponseDocument(app: INestApplication) {
  const { env } = process
  const { responseMap, codeType, responseBusiness } = ResponseCodeDocument
  const httpAdapter = app.getHttpAdapter()
  const baseUrl = env.SWAGGER_API_CODE_URL ?? '/api/code'
  const baseTemplateData = {
    url: baseUrl,
    title: env.SWAGGER_API_CODE_TITLE_URL,
    styles: fileStyle,
    codeType,
  }

  httpAdapter.get(baseUrl, (req: any, res: any) => {
    const template = Handlebars.compile(fileContent)
    res.send(
      template({
        ...baseTemplateData,
        responseMap,
        AllResponseBusiness: responseBusiness,
      })
    )
  })

  httpAdapter.get(`${baseUrl}/:business`, (req: any, res: any) => {
    const { business } = req.params
    const template = Handlebars.compile(fileBusinessContent)

    res.send(
      template({
        ...baseTemplateData,
        business,
        responseMap: responseMap[business],
      })
    )
  })
}

/**
 * 响应文档类
 */
export class ResponseCodeDocument {
  /**
   * 录入请求总数
   */
  static responseBusiness = {
    SUM: {
      resMap: [],
    },
  }

  /**
   * 响应集合
   */
  static responseMap = {}

  /**
   * code类型
   */
  static codeType: ResponseDocument.CodeObject[] = [
    {
      name: 'P',
      type: '参数错误',
    },
    {
      name: 'B',
      type: '业务错误',
    },
    {
      name: 'N',
      type: '网络错误',
    },
    {
      name: 'D',
      type: '数据库错误',
    },
    {
      name: 'F',
      type: '文件IO错误',
    },
    {
      name: 'I',
      type: 'socket.io错误',
    },
    {
      name: 'O',
      type: '其他错误',
    },
  ]

  /**
   * 注册响应业务
   * @param resClass 响应类
   * @param options  入参
   */
  static addResponseBusiness(
    resClass: Record<string, Status>,
    options: ResponseDocument.InstarOptions
  ) {
    const codeTypeObj: ResponseDocument.CodeTypeObject =
      ResponseCodeDocument.responseMap[options.name]?.map || {}

    // 初始化或者继承code
    ResponseCodeDocument.codeType.forEach(
      item =>
        !codeTypeObj[item.name] &&
        (codeTypeObj[item.name] = {
          type: item.type,
          resMap: [],
          code: {
            start: options.startCode || 0,
            end: options.startCode || 0,
            transferLogCount: 0,
          },
        })
    )

    // 注入
    Object.keys(resClass).map(key => {
      const item: Status = resClass[key]
      if (typeof item === 'function') {
        return false
      }

      let firstStr = item.codeType || String(item.code).substr(0, 1)
      if (!/[a-z]/i.test(firstStr)) firstStr = 'O'
      const curCodeType = codeTypeObj[firstStr]
      const currentMap = codeTypeObj[firstStr].resMap || codeTypeObj.O.resMap

      if (typeof item.code === 'number' && item.codeKeep) {
        curCodeType.code.start = item.code
      } else {
        curCodeType.code.start++
      }

      if (!item.codeKeep) {
        item.code = `${firstStr}${('0000' + curCodeType.code.start).substr(-4)}`
      }

      currentMap.push({
        key,
        extends: options.extends || '-',
        extendsTips: options.tips,
        ...item,
      })

      // 定位code结尾范围
      // if (curCodeType.code.end < curCodeType.code.start) {
      //   curCodeType.code.end = curCodeType.code.start;
      // }

      // 总数统计
      const currentResponseBusiness =
        ResponseCodeDocument.responseBusiness[firstStr] ||
        (ResponseCodeDocument.responseBusiness[firstStr] = {
          type: codeTypeObj[firstStr]?.type || '其他错误',
          resMap: [],
        })
      currentResponseBusiness.resMap.push(item)

      delete item.codeType

      ResponseCodeDocument.responseBusiness.SUM.resMap.push(item)
    })

    let total = 0
    const modules = new Set()
    Object.values(codeTypeObj).map(codeType => {
      total += codeType.resMap.length
      codeType.resMap.forEach(res => modules.add(res.extends))
    })

    ResponseCodeDocument.responseMap[options.name] = {
      total,
      options,
      map: codeTypeObj,
      modules: [...modules].join('、'),
    }
  }
}

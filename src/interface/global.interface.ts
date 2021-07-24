import { Request } from '@nestjs/common'

import { UserEntity } from 'src/modules/user/entity/user.entity'

import { ApiProperty } from '@nestjs/swagger'
import { ResponseDocument } from 'src/plugins/slm/resCodeDoc/type'

/**
 * 公共请求
 */
export interface GlobalRequest extends Request {
  /** 用户数据 */
  user: UserEntity
}

/**
 * 响应
 */
export class Response<T> {
  /**
   * 响应码
   * @description (每个错误的`唯一代码`，用于`鉴别错误类型`) 具体参考 [文档](http://127.0.0.1:3000/api/code)
   */
  @ApiProperty({
    description: '响应代码： (每个错误的`唯一代码`，用于`鉴别错误类型`) 具体参考 [文档](/api/code)',
    type: 'string | number',
  })
  code?: string | number = 0

  /**
   * 响应内容
   * @description 默认响应为 success，如果执行过程中遇到 错误、提示、警告 则会显示对应的内容
   */
  @ApiProperty({
    description:
      '响应内容： (默认响应为 `success`，如果执行过程中遇到 `错误、提示、警告` 则会显示对应的内容)',
  })
  message: string

  /**
   * 执行状态
   * @description true: 执行、获取、提交、修改、删除 成功，  false: 执行、获取、提交、修改、删除 失败
   */
  @ApiProperty({
    description:
      '执行状态： (`true`: 执行、获取、提交、修改、删除 成功，  `false`: 执行、获取、提交、修改、删除 失败)',
  })
  success?: boolean

  /**
   * 执行结果
   * @description 执行过程中返回的数据信息，可能为 `数据模型`、`字符串`、`布尔`、`空值`
   */
  @ApiProperty({
    type: 'DataModel | string | boolean | null',
    description: '执行结果：执行过程中返回的数据信息，可能为 `数据模型`、`字符串`、`布尔`、`空值`',
  })
  result?: T

  /**
   * 响应类型
   *  + P	参数错误
   *  + B	业务错误
   *  + N	网络错误
   *  + D	数据库错误
   *  + F	文件IO错误
   *  + I	socket.io错误
   *  + O	其他错误
   */
  @ApiProperty({
    description: `响应类型：
      \`P\`	参数错误、
      \`B\`	业务错误、
      \`N\`	网络错误、
      \`D\`	数据库错误、
      \`F\`	文件IO错误、
      \`I\`	socket.io错误、
      \`O\`	其他错误
    `,
  })
  codeType?: ResponseDocument.CodeType

  /** 是否保留原code */
  @ApiProperty({
    description: '是否保留原code',
  })
  codeKeep?: boolean

  /** 备注 */
  @ApiProperty({
    description: '备注',
  })
  note?: string
}

/** 列表模型 */
export interface ListPage<T> {
  /** 列表数据 */
  list: T[]
  /** 页数 */
  total: number
  /** 每页数量 */
  pageSize: number
  /** 当前页数 */
  page: number
}

/**
 * 常量 请求响应 接口
 * @file src/constants/response
 */
export namespace ConstantsResponse {
  /** 响应状态 */
  export type Status<T> = Response<T>

  /** 错误响应体 */
  export interface ErrorStatus<T> extends Status<T> {
    /** 追踪UUID */
    uuid?: string
    /** 报错时间 */
    time?: string
  }
}

/**
 * JWT策略Token
 */
export interface JwtToken {
  /** 盐 */
  iv?: string
  /** 用户ID */
  id?: number
  /** 过期时间 */
  iat?: number
  /** 生成时间 */
  exp?: number
}

// import * as path from 'path'
import * as Log4js from 'log4js'
import * as Util from 'util'
import dayjs from 'dayjs'
import * as StackTrace from 'stacktrace-js'
import chalk from 'chalk'
import { Logger as NestJsLogger } from '@nestjs/common'
import * as path from 'path'

// 定义日志级别
export enum LoggerLevel {
  ALL = 'ALL',
  MARK = 'MARK',
  TRACE = 'TRACE',
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL',
  OFF = 'OFF',
}

// 内容跟踪类
export class ContextTrace {
  constructor(
    public readonly context: string,
    public readonly path?: string,
    public readonly lineNumber?: number,
    public readonly columnNumber?: number
  ) {}
}

// 添加用户自定义的格式化布局函数。 可参考: https://log4js-node.github.io/log4js-node/layouts.html
Log4js.addLayout('json', logConfig => {
  return (logEvent: Log4js.LoggingEvent): string => {
    let moduleName = ''
    let position = ''

    // 日志组装
    const messageList: string[] = []
    logEvent.data.forEach((value: any) => {
      if (value instanceof ContextTrace) {
        moduleName = value.context
        // 显示触发日志的坐标（行，列）
        if (value.lineNumber && value.columnNumber) {
          position = `${value.lineNumber}, ${value.columnNumber}`
        }
        return
      }

      if (typeof value !== 'string') {
        value = Util.inspect(value, false, 3, true)
      }

      messageList.push(value)
    })

    // 日志组成部分
    const messageOutput: string = messageList.join(' ')
    const positionOutput: string = position ? ` [${position}]` : ''
    const typeOutput = `[${logConfig.type}] ${logEvent.pid.toString()}   - `
    const dateOutput = `${dayjs(logEvent.startTime).format('YYYY-MM-DD HH:mm:ss')}`
    const moduleOutput: string = moduleName ? `[${moduleName}] ` : '[LoggerService] '
    let levelOutput = `[${logEvent.level}] ${messageOutput}`

    // 根据日志级别，用不同颜色区分
    switch (logEvent.level.toString()) {
      case LoggerLevel.DEBUG:
        levelOutput = chalk.green(levelOutput)
        break
      case LoggerLevel.INFO:
        levelOutput = chalk.cyan(levelOutput)
        break
      case LoggerLevel.WARN:
        levelOutput = chalk.yellow(levelOutput)
        break
      case LoggerLevel.ERROR:
        levelOutput = chalk.red(levelOutput)
        break
      case LoggerLevel.FATAL:
        levelOutput = chalk.hex('#DD4C35')(levelOutput)
        break
      default:
        levelOutput = chalk.grey(levelOutput)
        break
    }

    return `${chalk.green(typeOutput)}${dateOutput}  ${chalk.yellow(
      moduleOutput
    )}${levelOutput}${positionOutput}`
  }
})

// 注入配置
Log4js.configure({
  appenders: {
    console: { type: 'console' },
    access: {
      type: 'dateFile', // 写入文件格式，并按照日期分类
      filename: `logs/access/access.log`, // 日志文件名，会命名为：access.2021-04-01.log
      alwaysIncludePattern: true, // 为true, 则每个文件都会按pattern命名，否则最新的文件不会按照pattern命名
      pattern: 'yyyy-MM-dd', // 日期格式
      // maxLogSize: 10485760,  // 日志大小
      daysToKeep: 30, // 文件保存日期30天
      numBackups: 3, //  配置日志文件最多存在个数
      compress: true, // 配置日志文件是否压缩
      category: 'http', // category 类型
      keepFileExt: true, // 是否保留文件后缀
    },
    // 一些app的 应用日志
    app: {
      type: 'dateFile',
      filename: `logs/out/app.log`,
      alwaysIncludePattern: true,
      layout: {
        type: 'pattern',
        pattern: "[%d{yyyy-MM-dd hh:mm:ss SSS}] [%p] -h: %h -pid: %z  msg: '\n%m' ",
      }, // 自定义的输出格式, 可参考 https://blog.csdn.net/hello_word2/article/details/79295344
      pattern: 'yyyy-MM-dd',
      daysToKeep: 30,
      numBackups: 3,
      keepFileExt: true,
    },
    // 异常日志
    errorFile: {
      type: 'dateFile',
      filename: `logs/error/error.log`,
      alwaysIncludePattern: true,
      layout: {
        type: 'pattern',
        pattern: "[%d{yyyy-MM-dd hh:mm:ss SSS}] [%p] -h: %h -pid: %z  msg: '\n%m' ",
      },
      pattern: 'yyyy-MM-dd',
      daysToKeep: 30,
      numBackups: 3,
      keepFileExt: true,
    },
    errors: {
      type: 'logLevelFilter',
      level: 'ERROR',
      appender: 'errorFile',
    },
  },
  categories: {
    default: { appenders: ['console', 'access', 'app', 'errors'], level: 'DEBUG' },
    mysql: { appenders: ['access', 'errors'], level: 'info' },
    http: { appenders: ['access'], level: 'DEBUG' },
  },
})

// 实例化
const logger = Log4js.getLogger('default')
const mysqlLogger = Log4js.getLogger('mysql') // 添加了typeorm 日志实例
logger.level = LoggerLevel.TRACE

// 定义log类方法
export class Logger {
  static trace(...args) {
    logger.trace(Logger.getStackTrace(), ...args)
  }

  static debug(...args) {
    logger.debug(Logger.getStackTrace(), ...args)
  }

  static log(...args) {
    logger.info(Logger.getStackTrace(), ...args)
  }

  static info(...args) {
    logger.info(Logger.getStackTrace(), ...args)
  }

  static warn(...args) {
    logger.warn(Logger.getStackTrace(), ...args)
  }

  static warning(...args) {
    logger.warn(Logger.getStackTrace(), ...args)
  }

  static error(...args) {
    logger.error(Logger.getStackTrace(), ...args)
  }

  static fatal(...args) {
    logger.fatal(Logger.getStackTrace(), ...args)
  }

  static access(...args) {
    const loggerCustom = Log4js.getLogger('http')
    loggerCustom.info(Logger.getStackTrace(), ...args)
  }

  // 日志追踪，可以追溯到哪个文件、第几行第几列
  // StackTrace 可参考 https://www.npmjs.com/package/stacktrace-js
  static getStackTrace(deep = 2): string {
    const stackList: StackTrace.StackFrame[] = StackTrace.getSync()
    const stackInfo: StackTrace.StackFrame = stackList[deep]
    const lineNumber: number = stackInfo.lineNumber
    const columnNumber: number = stackInfo.columnNumber
    const fileName: string = stackInfo.fileName
    const basename: string = path.basename(fileName)
    return `${basename}:${lineNumber}:${columnNumber} (line: ${lineNumber}, column: ${columnNumber}): \n`
  }
}
// 自定义typeorm 日志器, 可参考 https://blog.csdn.net/huzzzz/article/details/103191803/
export class DbLogger implements Logger {
  logQuery(query: string) {
    NestJsLogger.debug(query, 'logQuery', false)
    mysqlLogger.info(query)
  }

  logQueryError(error: string, query: string) {
    NestJsLogger.error(query, 'logQueryError')
    mysqlLogger.error(query, error)
  }

  logQuerySlow(time: number, query: string) {
    NestJsLogger.debug(query, 'logQuerySlow', false)
    mysqlLogger.info(query, time)
  }

  logSchemaBuild(message: string) {
    NestJsLogger.debug(message, 'logSchemaBuild', false)
    mysqlLogger.info(message)
  }

  logMigration(message: string) {
    NestJsLogger.debug(message, 'logMigration', false)
    mysqlLogger.info(message)
  }
  log(level: 'log' | 'info' | 'warn', message: any) {
    switch (level) {
      case 'info': {
        mysqlLogger.info(message)
        NestJsLogger.verbose(message)
        break
      }
      case 'warn': {
        mysqlLogger.warn(message)
        NestJsLogger.warn(message)
        break
      }
      default: {
        NestJsLogger.debug(message)
        break
      }
    }
  }
}

import * as chalk from 'chalk'
import * as path from 'path'

/** 控制台打印启动帮助文案 */
export function consoleHelpText() {
  const { env } = process
  const host = `http://${env.LISTEN_HOSTNAME}:${env.LISTEN_PROT}`

  console.log(chalk`
    ${env.APP_NAME}${env.APP_VERSION} 启动成功!

      当前环境     {red ${env.NODE_ENV}}
      数据库       {red ${env.DB_HOST}:${env.DB_PROT}}
      Redis        {red ${env.REDIS_HOST}:${env.REDIS_PORT}}

      服务器启动于 {green.underline ${host}}
      Swagger      {green.underline ${host}/${env.SWAGGER_API_DOC_URL}}
      OpenApi JSON {green.underline ${host}/${env.SWAGGER_IMPORT_OPENAPI_JSON_URL}}
      响应文档     {green.underline ${host}/${env.SWAGGER_API_CODE_URL}}

      Logger       {green.underline ${path.resolve('logs')}}
      数据库DEBUG  {yellow ${env.BG_DEBUG}}
  `)

  // chalk.green.underline(`${Host}:${params.Port}/${params.DocUrl}`)
}

export default () => {
  consoleHelpText()
}

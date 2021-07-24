import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { INestApplication } from '@nestjs/common'

/**
 * Swagger Document  文档
 * validation        全局注入 入参数据校验
 */
export default (app: INestApplication) => {
  const { env } = process
  const options = new DocumentBuilder()
    .setTitle(env.SWAGGER_CONTENT_TITLE)
    .setDescription(env.SWAGGER_CONTENT_DESCRIPTION)
    .setVersion(env.SWAGGER_VERSION)
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, options)

  return SwaggerModule.setup(env.SWAGGER_API_DOC_URL, app, document, {
    customSiteTitle: env.SWAGGER_TAB_TITLE,
    swaggerOptions: {
      docExpansion: 'list',
      deepLinking: true,
      displayOperationId: true,
      defaultModelsExpandDepth: 5,
      defaultModelExpandDepth: 4,
      defaultModelRendering: 'model',
      // filter: true,
      // showExtensions: true,
      // showCommonExtensions: true,
      displayRequestDuration: true,
      // tryItOutEnabled: true,
      syntaxHighlight: {
        active: true,
        theme: 'tomorrow-night',
      },
    },
  })
}

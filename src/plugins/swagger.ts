import { HttpException, HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ResponseBody } from '../constants/response';
import pluginsCfg from '../configs/plugins.cfg';


/**
 * Swagger Document  文档
 * validation        全局注入 入参数据校验
 */
export default (app: INestApplication) => {
  const { title, description, version, tag, url } = pluginsCfg.swagger;
  const options = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion(version)
    .addTag(tag)
    .addBearerAuth()
    .build()
  ;

  const document = SwaggerModule.createDocument(app, options);

  // 注入全局守卫数据校验 且自定义错误响应
  app.useGlobalPipes(new ValidationPipe({
    exceptionFactory: (validationErrors = []) => {
      const { constraints } = validationErrors[0];
      const message = constraints ? Object.values(constraints).pop() : '';
      throw new HttpException(
        ResponseBody.status('PARAMS_GUARDS', false, '', message),
        HttpStatus.OK,
      );
    }
  }));

  return SwaggerModule.setup(url, app, document);
}
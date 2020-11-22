import { HttpException, HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import pluginsCfg from '../configs/plugins.cfg';
import { Response } from '../constants/response';

export default (app: INestApplication) => {
  const { title, description, version, tag, url } = pluginsCfg.swagger;
  const options = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion(version)
    .addTag(tag)
    .build();

  const document = SwaggerModule.createDocument(app, options);

  // 注入全局守卫 且自定义响应
  app.useGlobalPipes(new ValidationPipe({
    exceptionFactory: (validationErrors = []) => {
      throw new HttpException(
        Response.status('PARAMS_GUARDS', false, validationErrors[0].constraints),
        HttpStatus.OK,
      );
    }
  }));

  return SwaggerModule.setup(url, app, document);
}
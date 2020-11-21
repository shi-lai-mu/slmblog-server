import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import pluginsCfg from '../configs/plugins.cfg'

export default (app: INestApplication) => {
  const { title, description, version, tag, url } = pluginsCfg.swagger;
  const options = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion(version)
    .addTag(tag)
    .build();

  const document = SwaggerModule.createDocument(app, options);
  return SwaggerModule.setup(url, app, document);
}
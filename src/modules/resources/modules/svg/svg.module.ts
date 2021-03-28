import { HttpModule, Module } from "@nestjs/common";

import { ResourcesSVGObtainController } from "./controller/obtain.controller";



/**
 * 资源业务 SVG模块
 */
@Module({
  imports: [
    HttpModule,
  ],
  controllers: [
    ResourcesSVGObtainController,
  ],
})
export class ResourcesSVGModule {};
import { Module } from '@nestjs/common'
import { ResourcesSVGModule } from './modules/svg/svg.module'

/**
 * 资源业务 模块
 */
@Module({
  imports: [ResourcesSVGModule],
})
export class ResourcesBusinessModule {}

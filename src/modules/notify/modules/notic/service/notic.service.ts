import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { NoticeDisable, NoticeEntity } from 'src/entity/notice.entity'

/**
 * 常规公告 逻辑层
 */
@Injectable()
export class NoticService {
  constructor(
    @InjectRepository(NoticeEntity) private readonly NoticeEntity: Repository<NoticeEntity>
  ) {}

  /**
   * 获取置顶的常规公告
   */
  async getTopNotic() {
    return this.NoticeEntity.findOne({ enable: NoticeDisable.TRUE }, { select: ['message'] })
  }
}

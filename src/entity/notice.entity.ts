import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { BaseInitEntity } from './baseInitEntity'

/** 公告启用状态 */
export enum NoticeDisable {
  TRUE = 1, // 已启用
  FALSE = 0, // 已禁用
}

const { tablePerfix } = BaseInitEntity.dbConfig
/** 公告实体表名 */
export const NoticeTableName = {
  NOTICE: tablePerfix + 'notice',
}

/** 常规公告表 */
@Entity({ name: NoticeTableName.NOTICE })
export class NoticeEntity {
  @PrimaryGeneratedColumn()
  id: number
  /** 公告内容 */
  @Column({ length: 500, comment: '公告内容' })
  message: string
  /** 是否启用 */
  @Column({ default: NoticeDisable.TRUE, comment: '是否启用' })
  enable: NoticeDisable
}

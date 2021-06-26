import { BaseInitEntity } from 'src/entity/baseInitEntity'
import { NotifyTableName } from 'src/modules/notify/constants/entity.cfg'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { FriendShow } from '../constants'

/** 友情链接基础实体 */
export abstract class FriendBase<T> extends BaseInitEntity<T> {
  /** 站点名 */
  @Column({
    length: 20,
    comment: '站点名字',
  })
  name: string

  /** 链接 */
  @Column({
    length: 100,
    comment: '站点链接',
  })
  link: string

  /** 邮箱 */
  @Column({
    comment: '邮箱',
  })
  email: string

  /** 站点图标 */
  @Column({
    comment: '站点图标',
  })
  icon: string

  /** 站点简介 */
  @Column({
    comment: '站点简介',
  })
  desc: string
}

/** 友情链接 实体 */
@Entity({ name: NotifyTableName.FRIEND_LOG })
export class FriendEntity extends FriendBase<typeof FriendBase> {
  /** 友情链接ID */
  @PrimaryGeneratedColumn({
    comment: '友情链接主ID',
  })
  id: number

  /** 友链显示状态 */
  @Column({
    enum: FriendShow,
    type: 'enum',
    comment: '友链显示状态',
  })
  is_show: FriendShow
}

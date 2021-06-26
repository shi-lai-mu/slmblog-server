import { NotifyTableName } from 'src/modules/notify/constants/entity.cfg'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { SubFriendReviewStatus } from '../constants'
import { FriendBase } from './friend.entity'

/** 友情链接 审核实体 */
@Entity({ name: NotifyTableName.FRIEND_REVIEW })
export class FriendReviewEntity extends FriendBase<SubmitFriendReview> {
  /** 审核ID */
  @PrimaryGeneratedColumn({
    comment: '审核ID',
  })
  id: number

  /** 审核状态 */
  @Column({
    comment: '审核状态',
    type: 'enum',
    enum: SubFriendReviewStatus,
    default: SubFriendReviewStatus.FAIL,
  })
  status: SubFriendReviewStatus
}

/** 存储 友链提交实体 基本数据 */
class SubmitFriendReview {
  /** 审核ID */
  id: number
  /** 站点名 */
  name: string
  /** 链接 */
  link: string
  /** 邮箱 */
  email: string
  /** 站点图标 */
  icon: string
  /** 申请原因/内容 */
  desc: string
}

import { ApiProperty } from '@nestjs/swagger'
import { isURL } from 'class-validator'
import { ValidateThrow } from 'src/constants/response'
import { SubFriendReviewStatus } from '../constants'

/** 获取友情链接参数 */
export class GetFriendListDto {
  /** 页数 */
  @ApiProperty({
    description: '当前页数',
    default: 1,
  })
  page: number

  /** 个数 */
  @ApiProperty({
    description: '每页个数',
    default: 10,
  })
  pageSize: number
}

/** 提交友情链接入参 */
export class SubmitFriendDto {
  /** 站点名字 */
  @ApiProperty({
    description: '站点名字',
  })
  name: string

  /** 链接 */
  @ApiProperty({
    description: '链接',
  })
  link: string

  /** 申请内容 */
  @ApiProperty({
    description: '申请内容',
  })
  desc: string

  /** 站点图标 */
  @ApiProperty({
    description: '站点图标',
  })
  icon: string

  /** 邮箱 */
  @ApiProperty({
    description: '邮箱(用于得到通知)',
  })
  email: string

  // @ApiProperty({
  //   description: '审核状态',
  //   enum: SubFriendReviewStatus,
  // })
  // status: SubFriendReviewStatus;
}

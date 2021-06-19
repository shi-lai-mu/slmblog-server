import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

import { responseList, skipPage } from 'src/utils/collection'
import { NotifyEmailService } from '../../email/service/email.service'
import ConfigsService from 'src/modules/coreModules/config/configs.service'

import { FriendShow } from '../constants'
import { FriendEntity } from '../entity/friend.entity'
import { FriendReviewEntity } from '../entity/friendReview.entity'
import { GetFriendListDto, SubmitFriendDto } from '../dto/friend.dto'

/**
 * 通知业务 友情链接 逻辑层
 */
export class FriendService {
  constructor(
    /** 核心 配置业务 逻辑层 */
    private readonly ConfigService: ConfigsService,

    /** 储存库 友链 */
    @InjectRepository(FriendEntity)
    private readonly Friend: Repository<FriendEntity>,

    /** 储存库 友链审核 */
    @InjectRepository(FriendReviewEntity)
    private readonly FriendReview: Repository<FriendReviewEntity>,

    /** 通知业务 邮箱 逻辑层 */
    private readonly NotifyEmailService: NotifyEmailService
  ) {}

  /**
   * 获取 友情链接 列表
   * @param friendDto 获取链接参数
   */
  async getFriendList(friendDto: GetFriendListDto) {
    const { page, pageSize } = friendDto
    const [list, total] = await this.Friend.findAndCount({
      select: ['name', 'link', 'icon'],
      where: {
        is_show: FriendShow.SHOW,
      },
      skip: skipPage(page, pageSize),
      take: pageSize,
    })
    return responseList(page, pageSize, list, total)
  }

  /**
   * 提交友情链接
   * @param submitFriendDto 友情链接数据
   */
  async submitFriend(submitFriendDto: SubmitFriendDto) {
    const { email, name } = submitFriendDto
    const find = await this.FriendReview.findOne({ email })

    // 查到邮箱重复提交申请进行数据覆盖
    let saveData = submitFriendDto
    if (find) {
      saveData = {
        ...find,
        ...submitFriendDto,
        id: find.id,
      } as FriendReviewEntity
    } else {
      // 通知收件箱收到友链申请
      const { web } = this.ConfigService
      this.NotifyEmailService.send({
        to: web.email.support,
        subject: `【友链业务】收到友链申请 ${name} in ${email}`,
        html: JSON.stringify(submitFriendDto),
      })
    }

    const { id } = await this.FriendReview.save(saveData)
    return !!id
  }

  /**
   * 获取单条审核id
   * @param id 审核ID
   */
  async findReview(id: FriendEntity['id']) {
    return this.FriendReview.findOne(id)
  }
}

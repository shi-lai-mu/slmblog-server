import { InjectRepository } from "@nestjs/typeorm";
import { responseList, skipPage } from "src/utils/collection";
import { Repository } from "typeorm";
import { FriendShow } from "../constants";
import { GetFriendListDto, SubmitFriendDto } from "../dto/friend.dto";
import { FriendEntity } from "../entity/friend.entity";
import { FriendReviewEntity } from "../entity/friendReview.entity";

/**
 * 通知业务 友情链接 逻辑层
 */
export class FriendService {
  constructor(
    @InjectRepository(FriendEntity) private readonly Friend: Repository<FriendEntity>,
    @InjectRepository(FriendReviewEntity) private readonly FriendReview: Repository<FriendReviewEntity>,
  ) {}

  
  /**
   * 获取 友情链接 列表
   * @param friendDto 获取链接参数
   */
  async getFriendList(friendDto: GetFriendListDto) {
    const { page, pageSize } = friendDto;
    const [ list, total ] = await this.Friend.findAndCount({
      select: [
        'name',
        'link',
      ],
      where: {
        is_show: FriendShow.SHOW,
      },
      skip: skipPage(page, pageSize),
      take: pageSize,
    });
    return responseList(page, pageSize, list, total);
  }


  /**
   * 提交友情链接
   * @param submitFriendDto 友情链接数据
   */
  async submitFriend(submitFriendDto: SubmitFriendDto) {
    const find = await this.FriendReview.findOne({
      email: submitFriendDto.email,
    });
    console.log(find);
    
    // const { } = await this.FriendReview.save({
    //   ...find,
    // })


  }


  /**
   * 获取单条审核id
   * @param id 审核ID
   */
  async findReview(id: FriendEntity['id']) {
    return this.FriendReview.findOne(id);
  }
}
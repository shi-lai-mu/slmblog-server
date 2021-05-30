import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Get, Query } from "@nestjs/common";

import { MainCPrefix } from "../constants";
import { GetFriendListDto, SubmitFriendDto } from "../dto/friend.dto";
import { FriendService } from "../service/friend.service";


/**
 * 通知模块 友情链接 控制层
 */
@Controller(MainCPrefix + '/friend')
@ApiTags('通知')
export class FriendController {

  constructor(
    private readonly friendService: FriendService,
  ) {}


  /**
   * 获取 友情链接 列表
   * @param getParams 获取链接参数
   */
  @Get()
  @ApiOperation({
    summary: '获取 友情链接 列表',
    description: '获取 可显示的前几位友情链接',
  })
  async getFriendList(@Query() getQuery: GetFriendListDto) {
    return this.friendService.getFriendList(getQuery);
  }


  /**
   * 提交 友情链接 申请
   * @param submitFriendDto 友情链接数据
   */
  async submitFriend(@Body() submitFriendDto: SubmitFriendDto) {
    
  }
}

import { AuthGuard } from '@nestjs/passport';
import { ApiBasicAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post, Request, UseGuards, Get, Req, Param } from '@nestjs/common';

import { UserService } from './user.service';
import { User } from 'src/entity/user.entity';
import { UserRegisterDto } from './dto/user.dto';
import { UserServiceBase } from './user.service';
import { JwtAuthGuard } from './auth/jwt.strategy';
import { getClientIP } from 'src/utils/collection';
import { APIPrefix } from 'src/constants/constants';
import { ResponseEnum } from 'src/constants/response';
import { GlobalRequest } from 'src/interface/gloabl.interface';
import { CurUser } from 'src/core/decorators/global.decorators';
import { ResBaseException } from 'src/core/exception/res.exception';
import { FrequentlyGuards } from 'src/core/guards/frequently.guards';
import { UserConfigService } from '../config/user/userConfig.service';
import { UserSpace } from 'src/interface/user.interface';
// import { plainToClass } from 'class-transformer';

export const _USER_PATH_NAME_ = APIPrefix + 'user';

/**
 * 用户类 控制层
 */
@Controller(_USER_PATH_NAME_)
@ApiTags('用户')
export class UserAccountController {


  constructor(
    private readonly UserService: UserService,
    private readonly UserConfigService: UserConfigService,
  ) {}


  /**
   * 注册账号
   * @param loginBody 账号及密码
   */
  @Post('register')
  @UseGuards(FrequentlyGuards({ interval: 0.5 }))
  @ApiOperation({ summary: '注册'})
  async register(@Body() body: UserRegisterDto, @Request() req?: GlobalRequest) {
    const { account } = body;

    const nameFormat = /^[a-z0-9_\-@\.]+$/i.test(account);
    const nameFormatReg = [
      /^(\.+|\-+|_+|&+)$/,
    ].some(v => v.test(account));

    if (!nameFormat || nameFormatReg) {
      throw new ResBaseException(ResponseEnum.USER.ACCOUNT_FORMAT);
    }

    let userAgent = req.headers['user-agent'];
    if (userAgent) {
      userAgent = UserServiceBase.getSystemPlatform(userAgent);
    }

    const user = await this.UserService.create(body, {
      ip: getClientIP(req),
      systemPlatform: userAgent,
    });

    return user;
  }


  /**
   * 登录账号
   * @param loginBody 账号及密码
   */
  @Post('signin')
  @UseGuards(AuthGuard('local'))
  @ApiOperation({ summary: '登录'})
  async login(@CurUser() user: User, @Req() req?: GlobalRequest) {
    this.UserService.login(user, {
      ip: getClientIP(req),
      systemPlatform: req.headers['user-agent'],
    });
    return this.UserService.find(user);
  }


  /**
   * 获取个人信息
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取个人信息'})
  @ApiBasicAuth()
  async info(@CurUser() user: UserSpace.UserInfo) {
    delete user.password;
    delete user.iv;
    user.config = await this.UserConfigService.getConfig(user.id);
    return user;
  }


  /**
   * 获取其他用户数据
   * @param id 用户ID
   */
  @Get(':id')
  @ApiOperation({ summary: '获取其他用户数据' })
  async outherUser(@Param('id') id: User['id']) {
    const user = await this.UserService.outherUser(id);
    if (!user) {
      throw new ResBaseException(ResponseEnum.USER.FIND_USER_NULL);
    }
    return user;
  }


  /**
   * 刷新令牌
   */
  @Get('refresh/token')
  @ApiOperation({ summary: '刷新令牌' })
  async refreshJWT(@Req() req?: GlobalRequest) {
    return this.UserService.refreshJWT(req.headers['authorization']);
  }
}
import { Body, Controller, Post, Request, Res, UseGuards, Response, Get, Req, Param } from '@nestjs/common';
import { UserLoginDto, UserRegisterDto } from './dto/user.dto';
import { UserService } from './user.service';
import { FrequentlyGuards } from 'src/core/guards/frequently.guards';
import { ResBaseException } from 'src/core/exception/res.exception';
import { ResponseEnum } from 'src/constants/response';
import { getClientIP } from 'src/utils/collection';
import { ApiBasicAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GlobalRequest } from 'src/interface/gloabl.interface';
import { CurUser } from 'src/core/decorators/global.decorators';
import { User } from 'src/entity/user.entity';
import { JwtAuthGuard } from './auth/jwt.strategy';
import { plainToClass } from 'class-transformer';
import { UserServiceBase } from './user.service'
import { APIPrefix } from 'src/constants/constants';

/**
 * 用户类 控制层
 */
@Controller(APIPrefix + 'user')
@ApiTags('用户')
export class UserAccountController {


  constructor(
    private readonly UserService: UserService,
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
  async login(@CurUser() user: User, @Body() body: UserLoginDto, @Req() req?: GlobalRequest) {
    this.UserService.login(user, {
      ip: getClientIP(req),
      systemPlatform: req.headers['user-agent'],
    });
    return plainToClass(User, user);
  }


  /**
   * 获取个人信息
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取个人信息'})
  @ApiBasicAuth()
  async info(@CurUser() user: User) {
    return plainToClass(User, user);
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
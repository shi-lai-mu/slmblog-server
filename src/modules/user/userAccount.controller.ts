import { Body, Controller, Post, Request, Res, UseGuards, Response, Get, Req } from '@nestjs/common';
import { UserLoginDto, UserRegisterDto } from './dto/user.dto';
import { UserService } from './user.service';
import { FrequentlyGuards } from 'src/core/guards/frequently.guards';
import { ResBaseException } from 'src/core/exception/res.exception';
import { ResponseBody, ResponseEnum } from 'src/constants/response';
import { getClientIP } from 'src/utils/collection';
import { ApiBasicAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GlobalRequest } from 'src/interface/gloabl.interface';
import { CurUser } from 'src/core/decorators/global.decorators';
import { User } from 'src/entity/user.entity';
import { JwtAuthGuard } from './auth/jwt.strategy';

/**
 * 用户类 控制层
 */
@Controller('user')
@ApiTags('用户账号')
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
      userAgent = (userAgent.match(/(MSIE|Firefox|Presto|QQBrowser|MetaSr|UCBrowser|Chrome|Safari|Edge|Macintosh|MicroMessenger|Baiduspider)(\/[\d\.]+)?/) || [''])[0];
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
  async login(@Body() body: UserLoginDto, @Request() req?: GlobalRequest) {
    return this.UserService.login(body, {
      ip: getClientIP(req),
      systemPlatform: req.headers['user-agent'],
    });
  }


  /**
   * 获取个人信息
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取个人信息'})
  @ApiBasicAuth()
  async info(@CurUser() user: User) {
    return this.UserService.InputFind({ id: user.id });
  }
}
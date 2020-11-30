import { Body, Controller, Post, Request, Res, UseGuards, Response } from '@nestjs/common';
import { UserLoginDto } from './dto/user.dto';
import { UserService } from './user.service';
import { FrequentlyGuards } from 'src/core/guards/frequently.guards';
import { ResBaseException } from 'src/core/exception/res.exception';
import { ResponseBody, ResponseEnum } from 'src/constants/response';
import { getClientIP } from 'src/utils/collection';

/**
 * 用户类 控制层
 */
@Controller('user')
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
  async register(@Body() loginBody: UserLoginDto, @Request() req?: Request, @Res() res?: any) {
    const { account } = loginBody;

    const nameFormat = /^[a-z0-9_\-@\.]+$/i.test(account);
    const nameFormatReg = [
      /^(\.+|\-+|_+|&+)$/,
    ].some(v => v.test(account));

    if (!nameFormat || nameFormatReg) {
      throw new ResBaseException(ResponseEnum.USER.ACCOUNT_FORMAT);
    }

    const user = await this.UserService.create(loginBody, {
      ip: getClientIP(req),
      systemPlatform: req.headers['user-agent'],
    });

    res.json(ResponseBody.status(
      user ? 'SUCCESS' : 'ERROR',
      !!user,
      user,
    ));
  } 
  
}
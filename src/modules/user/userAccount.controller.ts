import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { UserLoginDto } from './dto/user.dto';
import { LoginGuards } from '../../core/guards/login.guards';
import { UserService } from "./user.service";

@Controller('user')
export class UserAccountController {


  constructor(
    private readonly UserService: UserService,
  ) {}

  /**
   * 登录账号
   * @param loginBody 账号及密码
   */
  @Post()
  @UseGuards(LoginGuards)
  async login(@Body() loginBody: UserLoginDto) {
    console.log(loginBody);
    await this.UserService.create(loginBody);
  } 
  
}
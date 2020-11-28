import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserBaseDto } from './dto/user.dto';
import { LoginGuards } from '../../core/guards/login.guards';

@Controller({
  path: 'user',
})
export class UserController {
  constructor(private userService: UserService) {}

  // @Get()
  // async findAll(): Promise<UserBaseDto[]> {
  //   console.log(this.userService);
  //   return this.userService.findAll();
  // }


  // @Post()
  // @UseGuards(LoginGuards)
  // async create(@Query() createUserDto: UserBaseDto) {
  //   this.userService.create(createUserDto);
  // }
}

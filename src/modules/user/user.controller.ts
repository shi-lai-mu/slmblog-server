import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserBaseDto } from './dto/user.dto';
import { ActiveGuards } from '../../core/guards/active.guards';

@Controller({
  host: ':dev.slmblog.com',
  path: 'user',
})
export class UserController {
  constructor(private userService: UserService<any>) {}

  @Get()
  async findAll(): Promise<UserBaseDto[]> {
    console.log(this.userService);
    return this.userService.findAll();
  }


  @Post()
  @UseGuards(ActiveGuards)
  async create(@Query() createUserDto: UserBaseDto) {
    console.log(createUserDto);
    
    this.userService.create(createUserDto);
  }
}

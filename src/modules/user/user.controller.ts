import { Controller } from '@nestjs/common';
import { APIPrefix } from 'src/constants/constants';
import { UserService } from './user.service';

@Controller({
  path: APIPrefix + 'user',
})
export class UserController {
  constructor(private userService: UserService) {}
}

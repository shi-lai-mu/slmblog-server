import { Controller } from '@nestjs/common';

import { UserService } from './user.service';
import { APIPrefix } from 'src/constants/constants';

@Controller({
  path: APIPrefix + 'user',
})
export class UserController {
  constructor(private userService: UserService) {}
}

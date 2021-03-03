import { Controller } from '@nestjs/common';

import { UserService } from '../service/user.service';
import { APIPrefix } from 'src/constants/constants';

/**
 * 用户业务 控制层
 */
@Controller(APIPrefix + 'user')
export class UserController {
  constructor(private userService: UserService) {}
}

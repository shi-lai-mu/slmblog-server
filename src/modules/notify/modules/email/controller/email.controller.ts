import { Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

// import { NotifyEmailService } from '../service/email.service'

import { MainCPrefix } from '../../../constants/controller.cfg'
// import { NotifyEmailRegisterAccountDto } from "../dto/email.dto";

/**
 * 通知业务 邮箱 控制层
 */
@Controller(MainCPrefix + '/email')
@ApiTags('通知')
export class NotifyEmailController {
  // constructor(private readonly NotifyEmailService: NotifyEmailService) {}
}

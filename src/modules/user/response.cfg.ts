import { USER_CONSTANTS } from '../../constants/constants';
import { Status } from '../../constants/response';

export class UserResponse {
  static readonly LOGIN_LENGTH: Status = { code: 1100, message: `账号 格式不正确，只能在${USER_CONSTANTS.ACCOUNT_MIN_LENGTH}-${USER_CONSTANTS.ACCOUNT_MAX_LENGTH}之间，只能包含中英文和下划线。` };
}
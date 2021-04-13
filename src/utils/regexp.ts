import { ResBaseException } from "src/core/exception/res.exception";
import { UserAccountResponse } from "src/modules/user/modules/account/constants/account.response";

/**
 * 是否为规范的昵称
 * @param nickname 昵称
 * @param errThrow 不符合时是否直接抛出请求异常
 * @returns 是否符合规则
 */
export function isNickname(nickname: string, errThrow: boolean = true) {
  nickname = nickname.trim();
  if (!/^[\a-z0-9_u4E00-\u9FFF]+$/.test(nickname)) {
    const ERR = UserAccountResponse.NICKNAME_FORMAT;
    if (errThrow) {
      throw new ResBaseException(ERR);
    }
    return ERR.message;
  }
  return true;
};

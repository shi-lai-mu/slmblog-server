import { BaseInitEntity } from "src/entity/baseInitEntity";



const { tablePerfix } = BaseInitEntity.dbConfig;
/**
 * 通知实体表名
 */
export const NotifyTableName = {
  /** 友情链接 记录表 */
  FRIEND_LOG:    tablePerfix + 'friend_log',
  /** 友情链接 审核表 */
  FRIEND_REVIEW: tablePerfix + 'friend_review',
};

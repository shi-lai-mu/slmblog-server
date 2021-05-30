import { NotifyTableName } from "src/modules/notify/constants/entity.cfg";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { FriendShow } from "../constants";

/**
 * 友情链接 实体
 */
@Entity({ name: NotifyTableName.FRIEND_LOG })
export class FriendEntity {

  /**
   * 友情链接ID
   */
  @PrimaryGeneratedColumn({
    comment: '友情链接主ID',
  })
  id: number;

  /**
   * 站点名
   */
  @Column({
    length: 20,
    comment: '站点名字',
  })
  name: string;

  /***
   * 链接
   */
  @Column({
    length: 100,
    comment: '站点链接',
  })
  link: string;

  /**
   * 友链显示状态
   */
  @Column({
    enum: FriendShow,
    type: 'enum',
    comment: '友链显示状态',
  })
  is_show: FriendShow;
}
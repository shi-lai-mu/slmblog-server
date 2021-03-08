import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { User } from "./user.entity";

import { UserTableName } from "../constants/entity.cfg";
import { USER_CONSTANTS } from "src/constants/constants";
import { BaseInitEntity } from "src/entity/baseInitEntity";



/**
 * 用户 徽章实体
 */
@Entity({
  name: UserTableName.BADGE
})
export class Badge extends BaseInitEntity<{}> {
  /**
   * ID
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 名称
   */
  @Column({ length: USER_CONSTANTS.BADGE_NAME_MAX_LENGTH, comment: '名称' })
  name: string;

  /**
   * 图标
   */
  @Column({ length: USER_CONSTANTS.BADGE_ICON_MAX_LENGTH, comment: '图标' })
  icon: string;

  /**
   * 简介
   */
  @Column({ length: USER_CONSTANTS.BADEG_DESC_MAX_LENGTH, comment: '简介' })
  description: string;

  /**
   * 拥有者
   */
  @OneToMany(type => User, user => user.id)
  owner: User[];
}

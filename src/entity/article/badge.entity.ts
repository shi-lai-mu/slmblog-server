import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { USER_CONSTANTS } from "src/constants/constants";
import { User, UserTableName } from "../user.entity";


/**
 * 徽章实体
 */
@Entity({ name: UserTableName.BADGE })
export class Badge {
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
  @OneToMany(ts => User, user => user.id)
  owner: User[];
}

import { ArticleTableName } from "src/modules/article/constants/entity.cfg";
import { Entity, PrimaryGeneratedColumn } from "typeorm";

import { BaseInitEntity } from "../baseInitEntity";

/**
 * 文章类目实体
 */
@Entity({
  name: ArticleTableName.CATEGORY
})
export class ArticleCategory extends BaseInitEntity<{}> {
  /**
   * 类目ID
   */
  @PrimaryGeneratedColumn()
  id: number;

}
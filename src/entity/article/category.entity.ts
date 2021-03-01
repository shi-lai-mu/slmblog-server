import { Entity, PrimaryGeneratedColumn } from "typeorm";

import { ArticleTableName } from "./constants";
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
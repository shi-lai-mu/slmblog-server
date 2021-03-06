import { ApiProperty } from "@nestjs/swagger";

/**
 * 创建文章类目
 */
export class CreateArticleCategoryDto {
  /**
   * 类目ID
   */
  @ApiProperty({
    description: '类目ID',
    default: '测试类目',
  })
  names: string;

  /**
   * 父级类目ID
   */
  @ApiProperty({
    description: '类目ID',
    default: 0,
  })
  parentId?: number;

  /**
   * 指向链接
   */
  @ApiProperty({
    description: '指向链接',
  })
  link?: string;
}
import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CurUser } from "src/core/decorators/global.decorators";
import { JwtPermissionStrategy } from "src/core/strategy/jwt.strategy";
import { UserRole } from "src/modules/user/constants/entity.cfg";
import { User } from "src/modules/user/entity/user.entity";
import { MainCPrefix } from "../constants/controller.cfg";
import { CreateArticleCategoryDto } from "../dto/category.dto";
import { ArticleCategoryService } from "../service/category.service";

/**
 * 文章业务 类目 控制层
 */
@Controller(MainCPrefix + '/category')
@ApiTags('文章')
export class ArticleCategoryContorller {

  constructor(
    private readonly CategoryService: ArticleCategoryService,
  ) {}


  /**
   * 创建类目
   */
  @Post('append')
  @UseGuards(new JwtPermissionStrategy(UserRole.SuperAdmin))
  @ApiBearerAuth()
  @ApiOperation({
    summary: '新增类目',
    description: '`[超管权限]` 新增类目',
  })
  async create(@Body() CreateCategoryDto: CreateArticleCategoryDto, @CurUser() user: User) {
    return this.CategoryService.create(CreateCategoryDto, user);
  }


  /**
   * 获取类目信息
   * @params id 类目ID
   * @params ids 类目ID合集
   */
  @Get('info')
  @ApiOperation({
    summary: '获取类目信息',
    description: '支持获取 字符串/类目ID数组/类目ID 来获取类目信息',
  })
  async information(@Query('id') id?: number, @Query('ids') ids?: number[] | string) {
    return this.CategoryService.information(ids || id);
  }


  /**
   * 获取类目信息
   */
  @Get('list')
  @ApiOperation({
    summary: '获取所有类目列表',
    description: '支持获取 字符串/类目ID数组/类目ID 来获取类目列表',
  })
  async list() {
    return this.CategoryService.list();
  }

} 
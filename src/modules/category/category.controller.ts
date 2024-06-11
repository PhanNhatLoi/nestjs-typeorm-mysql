import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { ICategoryService } from '@modules/category/services/category.service.interface';
import { FilterCategoryDto } from '@modules/category/services/dto/filter-category.dto';
import { CreateCategoryDto } from '@modules/category/services/dto/CreateCategory.dto';
import { Roles } from 'src/base/decorators/roles.decorator';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { USER_ROLE } from 'src/shared/constants/global.constants';
import { JwtAccessTokenGuard } from '@modules/auth/guards/jwt-access-token.guard';
import { UpdateCategoryDto } from '@modules/category/services/dto/update-category.dto';

@Controller('category')
@ApiTags('category')
export class CategoryController {
  constructor(private readonly _categoryService: ICategoryService) {}
  // ==========
  // get list pagination
  // ==========

  @Get('list')
  async getList(@Query() pageOptionsDto: FilterCategoryDto) {
    return await this._categoryService.getPagination(pageOptionsDto);
  }

  // ==========
  // get list pagination
  // ==========

  // ==========
  // get all list category
  // ==========
  @Get('all')
  async getAll() {
    return await this._categoryService.gets();
  }
  // ==========
  // get all list category
  // ==========

  // ==========
  // create category
  // ==========
  @UseGuards(JwtAccessTokenGuard, RolesGuard)
  @Roles(USER_ROLE.SUPPER_ADMIN)
  @ApiBody({
    type: CreateCategoryDto,
    examples: {
      user: {
        value: {
          name: 'Thương mại',
          description: 'Dịch vụ thương mại',
          imageUrl: 'default-url.png',
        } as CreateCategoryDto,
      },
    },
  })
  @Post()
  async addCategory(@Body() payload: CreateCategoryDto, @Req() req) {
    const { user } = req;
    return await this._categoryService.create(user, payload);
  }
  // ==========
  // create category
  // ==========

  // ==========
  // delete category
  // ==========

  @UseGuards(JwtAccessTokenGuard, RolesGuard)
  @Roles(USER_ROLE.SUPPER_ADMIN)
  @ApiParam({
    name: 'id',
    description: 'The ID of the item to delete',
    type: Number, // or Number, depending on your ID type
  })
  @Delete(':id')
  async removeCategory(@Param() params) {
    const { id } = params;
    return await this._categoryService.delete(id);
  }
  // ==========
  // delete category
  // ==========

  // ==========
  // update category
  // ==========
  @UseGuards(JwtAccessTokenGuard, RolesGuard)
  @Roles(USER_ROLE.SUPPER_ADMIN)
  @ApiBody({
    type: UpdateCategoryDto,
    examples: {
      user: {
        value: {
          name: 'Thương mại',
          description: 'Dịch vụ thương mại',
          imageUrl: 'default-url.png',
        } as UpdateCategoryDto,
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the item to update',
    type: Number, // or Number, depending on your ID type
  })
  @Put(':id')
  async updateCategory(
    @Body() payload: UpdateCategoryDto,
    @Param() params,
    @Req() req,
  ) {
    const { id } = params;
    const { user } = req;
    return await this._categoryService.update(user, id, payload);
  }
  // ==========
  // update category
  // ==========
}

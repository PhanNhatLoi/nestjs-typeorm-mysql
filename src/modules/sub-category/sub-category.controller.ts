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
import { Roles } from 'src/base/decorators/roles.decorator';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { USER_ROLE } from 'src/shared/constants/global.constants';
import { JwtAccessTokenGuard } from '@modules/auth/guards/jwt-access-token.guard';
import { ISubCategoryService } from './services/sub-category.service.interface';
import { FilterSubCategoryDto } from './services/dto/filter-category.dto';
import { CreateSubCategoryDto } from './services/dto/CreateCategory.dto';
import { UpdateSubCategoryDto } from './services/dto/update-category.dto';

@Controller('sub-category')
@ApiTags('Sub Category')
export class SubCategoryController {
  constructor(private readonly _subCategoryService: ISubCategoryService) {}
  // ==========
  // get detail
  // ==========
  @Get('detail/:id')
  @ApiParam({
    name: 'id',
    description: 'The ID of the item to get detail',
    type: Number, // or Number, depending on your ID type
  })
  async getDetail(@Param() params) {
    const { id } = params;
    return await this._subCategoryService.get(id);
  }
  // ==========
  // get detail
  // ==========

  // ==========
  // get list pagination
  // ==========

  @Get('list')
  async getList(@Query() pageOptionsDto: FilterSubCategoryDto) {
    return await this._subCategoryService.getPagination(pageOptionsDto);
  }

  // ==========
  // get list pagination
  // ==========

  // ==========
  // get all list sub category
  // ==========
  @Get('all')
  async getAll() {
    return await this._subCategoryService.gets();
  }
  // ==========
  // get all list sub category
  // ==========

  // ==========
  // create category
  // ==========
  @UseGuards(JwtAccessTokenGuard, RolesGuard)
  @Roles(USER_ROLE.SUPPER_ADMIN)
  @ApiBody({
    type: CreateSubCategoryDto,
    examples: {
      user: {
        value: {
          name: 'Thương mại',
          description: 'Dịch vụ thương mại',
          imageUrl: 'default-url.png',
          category: 1,
        } as CreateSubCategoryDto,
      },
    },
  })
  @Post()
  async addSubCategory(@Body() payload: CreateSubCategoryDto, @Req() req) {
    const { user } = req;
    return await this._subCategoryService.create(user, payload);
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
  async removeSubCategory(@Param() params) {
    const { id } = params;
    return await this._subCategoryService.delete(id);
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
    type: UpdateSubCategoryDto,
    examples: {
      user: {
        value: {
          name: 'Thương mại',
          description: 'Dịch vụ thương mại',
          imageUrl: 'default-url.png',
          category: 1,
        } as UpdateSubCategoryDto,
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
    @Body() payload: UpdateSubCategoryDto,
    @Param() params,
    @Req() req,
  ) {
    const { id } = params;
    const { user } = req;
    return await this._subCategoryService.update(user, id, payload);
  }
  // ==========
  // update category
  // ==========
}

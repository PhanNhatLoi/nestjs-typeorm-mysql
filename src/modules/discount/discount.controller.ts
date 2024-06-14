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
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/base/controllers/base.controller';
import { FilterDiscountDto } from './services/dto/filter-discount.dto';
import { CreateDiscountDto } from './services/dto/create-language.dto';
import { JwtAccessTokenGuard } from '@modules/auth/guards/jwt-access-token.guard';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { Roles } from 'src/base/decorators/roles.decorator';
import { USER_ROLE } from 'src/shared/constants/global.constants';
import { IDiscountService } from './services/discount.service.interface';
import { UpdateDiscountDto } from './services/dto/update-discount.dto';

@Controller('discount')
@ApiTags('Discount')
export class DiscountController extends BaseController {
  constructor(private readonly _discountService: IDiscountService) {
    super();
  }

  // ==========
  // get list and filter
  // ==========
  @Get()
  @ApiQuery({
    name: 'random',
    type: 'enum',
    enum: ['true', 'false'],
  })
  async getPagination(
    @Query() pageOptionsDto: FilterDiscountDto,
    @Query('random') random: boolean,
  ) {
    pageOptionsDto.random = random;
    return await this._discountService.getPagination(pageOptionsDto);
  }
  // ==========
  // get list and filter
  // ==========

  // ==========
  // create discount
  // ==========
  @Post()
  @ApiBody({
    type: CreateDiscountDto,
    examples: {
      user: {
        value: {
          title: 'Chào hè ưu đãi 50%',
          description: 'Giảm nóng 50% cho ngành thương mại!!',
          imageUrl: 'default-discount-img.png',
          userId: 3,
          expiresTime: new Date(new Date().getTime() + 24 * 3600000),
        } as CreateDiscountDto,
      },
    },
  })
  @UseGuards(JwtAccessTokenGuard, RolesGuard)
  @Roles(USER_ROLE.SUPPER_ADMIN)
  async create(@Body() payload: CreateDiscountDto, @Req() req) {
    const { user } = req;
    return await this._discountService.create(user, payload);
  }
  // ==========
  // create discount
  // ==========

  // ==========
  // update discount
  // ==========
  @Put(':id')
  @ApiBody({
    type: UpdateDiscountDto,
    examples: {
      user: {
        value: {
          title: 'Chào hè ưu đãi 50%',
          description: 'Giảm nóng 50% cho ngành thương mại!!',
          imageUrl: 'default-discount-img.png',
          expiresTime: new Date(new Date().getTime() + 24 * 3600000),
        } as UpdateDiscountDto,
      },
    },
  })
  @UseGuards(JwtAccessTokenGuard, RolesGuard)
  @Roles(USER_ROLE.SUPPER_ADMIN)
  async update(
    @Param('id') id: number,
    @Body() payload: UpdateDiscountDto,
    @Req() req,
  ) {
    const { user } = req;
    return await this._discountService.update(user, Number(id), payload);
  }
  // ==========
  // update discount
  // ==========

  // ==========
  // delete discount
  // ==========
  @Delete(':id')
  @UseGuards(JwtAccessTokenGuard, RolesGuard)
  @Roles(USER_ROLE.SUPPER_ADMIN)
  async delete(@Param('id') id: number) {
    return await this._discountService.delete(Number(id));
  }
  // ==========
  // delete discount
  // ==========
}

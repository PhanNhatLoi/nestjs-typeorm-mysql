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
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/base/controllers/base.controller';
import { JwtAccessTokenGuard } from '@modules/auth/guards/jwt-access-token.guard';
import { AREA_TYPE, USER_ROLE } from 'src/shared/constants/global.constants';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { Roles } from 'src/base/decorators/roles.decorator';
import { IAreaService } from './services/area.service.interface';
import { FilterAreaDto } from './dto/filter.dto';
import { CreateAreaDto } from './dto/create.dto';

@Controller('area')
@ApiTags('Area')
export class AreaController extends BaseController {
  constructor(private readonly _areaService: IAreaService) {
    super();
  }
  // ==========
  // get list and filter
  // ==========
  @Get('province')
  async getProvince(@Query() query: FilterAreaDto) {
    return await this._areaService.gets(AREA_TYPE.PROVINCE, query);
  }
  @Get('district')
  async getDistrict(@Query() query: FilterAreaDto) {
    return await this._areaService.gets(AREA_TYPE.DISTRICT, query);
  }
  @Get('ward')
  async getWard(@Query() query: FilterAreaDto) {
    return await this._areaService.gets(AREA_TYPE.WARD, query);
  }
  // ==========
  // get list and filter
  // ==========

  // ==========
  // create area
  // ==========
  @UseGuards(JwtAccessTokenGuard, RolesGuard)
  @Roles(USER_ROLE.SUPPER_ADMIN)
  @ApiBody({
    type: CreateAreaDto,
    examples: {
      user: {
        value: {
          name: 'Hồ Chí Minh',
        } as CreateAreaDto,
      },
    },
  })
  @Post(':type')
  async create(
    @Body() payload: CreateAreaDto,
    @Req() req,
    @Param('type') type,
  ) {
    const { user } = req;
    payload.type = type;
    return await this._areaService.create(payload, user);
  }
  // ==========
  // create area
  // ==========

  // ==========
  // update area
  // ==========
  @UseGuards(JwtAccessTokenGuard, RolesGuard)
  @Roles(USER_ROLE.SUPPER_ADMIN)
  @ApiBody({
    type: CreateAreaDto,
    examples: {
      user: {
        value: {
          name: 'Hồ Chí Minh',
        } as CreateAreaDto,
      },
    },
  })
  @Put(':type/:id')
  async update(
    @Body() payload: CreateAreaDto,
    @Req() req,
    @Param('type') type,
    @Param('id') id,
  ) {
    const { user } = req;
    payload.type = type;
    return await this._areaService.update(Number(id), payload, user);
  }
  // ==========
  // delete area
  // ==========

  @UseGuards(JwtAccessTokenGuard, RolesGuard)
  @Roles(USER_ROLE.SUPPER_ADMIN)
  @Delete(':type/:id')
  async delete(@Param('type') type, @Param('id') id) {
    return await this._areaService.delete(type, id);
  }
  // ==========
  // delete area
  // ==========
}

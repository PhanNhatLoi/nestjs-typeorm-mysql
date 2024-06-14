import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/base/controllers/base.controller';
import { CreateLanguageDto } from '@modules/language/services/dto/create-language.dto';
import { JwtAccessTokenGuard } from '@modules/auth/guards/jwt-access-token.guard';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { Roles } from 'src/base/decorators/roles.decorator';
import { USER_ROLE } from 'src/shared/constants/global.constants';
import { UpdateLanguageDto } from '@modules/language/services/dto/update-language.dto';
import { ISettingsService } from './services/settings.service.interface';

@Controller('settings')
@ApiTags('Settings')
export class SettingsController extends BaseController {
  constructor(private readonly _settingsService: ISettingsService) {
    super();
  }

  // ==========
  // get list
  // ==========
  @Get('/languages')
  async getAllLanguages() {
    return await this._settingsService.getLanguages();
  }
  // ==========
  // get list
  // ==========

  // ==========
  // create language
  // ==========
  @ApiBody({
    type: CreateLanguageDto,
    examples: {
      data: {
        value: {
          name: 'Vietnamese',
          sortName: 'vi-VN',
        } as CreateLanguageDto,
      },
    },
  })
  @UseGuards(JwtAccessTokenGuard, RolesGuard)
  @Roles(USER_ROLE.SUPPER_ADMIN)
  @Post('language')
  async createLanguage(@Body() payload: CreateLanguageDto, @Req() req) {
    const { user } = req;
    return await this._settingsService.createLanguage(user, payload);
  }
  // ==========
  // create language
  // ==========

  // ==========
  // update language
  // ==========
  @ApiBody({
    type: UpdateLanguageDto,
    examples: {
      data: {
        value: {
          name: 'Vietnamese',
          sortName: 'vi-VN',
        } as UpdateLanguageDto,
      },
    },
  })
  @UseGuards(JwtAccessTokenGuard, RolesGuard)
  @Roles(USER_ROLE.SUPPER_ADMIN)
  @Put('language/:id')
  async updateLanguage(
    @Body() payload: UpdateLanguageDto,
    @Req() req,
    @Query('id') id: string,
  ) {
    const { user } = req;
    return await this._settingsService.updateLanguage(
      user,
      Number(id),
      payload,
    );
  }
  // ==========
  // update language
  // ==========

  // ==========
  // delete language
  // ==========
  @UseGuards(JwtAccessTokenGuard, RolesGuard)
  @Roles(USER_ROLE.SUPPER_ADMIN)
  @Delete('language/:id')
  async deleteLanguage(@Query('id') id: string) {
    return await this._settingsService.deleteLanguage(Number(id));
  }
  // ==========
  // delete language
  // ==========

  // ==========
  // get statistics
  // ==========
  @UseGuards(JwtAccessTokenGuard, RolesGuard)
  @Roles(USER_ROLE.ENTERPRISE, USER_ROLE.USER)
  @Get('statistics')
  async getStatistics(@Req() req) {
    const { user } = req;

    return await this._settingsService.getStatistics(user.id);
  }
  // ==========
  // get statistics
  // ==========
}

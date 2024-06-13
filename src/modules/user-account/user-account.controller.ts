import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/base/controllers/base.controller';
import { CreateUserAccountDto } from 'src/modules/user-account/dto/create-user-account.dto';
import { UpdateUserAccountDto } from 'src/modules/user-account/dto/update-user-account.dto';
import { IUserAccountService } from 'src/modules/user-account/services/user-account.service.interface';
import { Response } from 'express';

@Controller('user-account')
@ApiTags('user-account')
export class UserAccountController extends BaseController {
  constructor(private readonly _userAccountService: IUserAccountService) {
    super();
  }

  @Post()
  async create(@Body() payload: CreateUserAccountDto, @Res() res: Response) {
    const result = await this._userAccountService.create(payload);
    return this.response(res, result);
  }

  @Get()
  async getPagination(@Res() res: Response) {
    const result = await this._userAccountService.gets();
    return this.response(res, result);
  }

  @Get(':id')
  async get(@Param('id') id: number, @Res() res: Response) {
    const result = await this._userAccountService.get(id);
    return this.response(res, result);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() payload: UpdateUserAccountDto,
    @Res() res: Response,
  ) {
    const result = await this._userAccountService.update(id, payload);
    return this.response(res, result);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Res() res: Response) {
    const result = await this._userAccountService.delete(id);
    return this.response(res, result);
  }
}

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
import { BaseController } from 'src/base/controllers/base.controller';
import { IPartnerService } from './services/partner.service.interface';
import { FilterUserAccountDto } from '@modules/user-account/dto/filter-user-account.dto';
import { JwtAccessTokenGuard } from '@modules/auth/guards/jwt-access-token.guard';
import { CreateShareDto } from './dto/create-share.dto';
import {
  USER_ACTION_TYPE,
  USER_ROLE,
} from 'src/shared/constants/global.constants';
import { CreateRateDto } from './dto/create-rate.dto';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { Roles } from 'src/base/decorators/roles.decorator';
import { UpdateRateDto } from './dto/update-rate.dto';
import { FilterUserActionDto } from '@modules/user-action/services/dto/filter-action.dto';
import { CreateContactDto } from './dto/create-contact.dto';
import { FilterUserContactDto } from '@modules/user-contact/dto/filter-contact.dto';

@Controller('partner')
@ApiTags('Partner')
export class PartnerController extends BaseController {
  constructor(private readonly _partnerService: IPartnerService) {
    super();
  }

  // ==========
  // get list and filter
  // ==========
  @Get('list')
  async getPagination(@Query() pageOptionsDto: FilterUserAccountDto) {
    return await this._partnerService.getPagination(pageOptionsDto);
  }
  // ==========
  // get list and filter
  // ==========

  // ==========
  // get detail partner
  // ==========
  @Get('detail/:id')
  async get(@Param('id') id: number) {
    return await this._partnerService.get(id);
  }
  // ==========
  // get detail partner
  // ==========

  // ==========
  // list favorite partner
  // ==========
  @ApiParam({
    name: 'id',
    description: 'The ID of the item to get detail',
    type: Number, // or Number, depending on your ID type
  })
  @Get('favorite/:id')
  async getFavoritePartner(
    @Query() pageOptionsDto: FilterUserActionDto,
    @Param('id') id: string,
  ) {
    return await this._partnerService.getAction(
      Number(id),
      pageOptionsDto,
      USER_ACTION_TYPE.FAVORITE,
    );
  }
  // ==========
  // list favorite partner
  // ==========
  // ==========
  // list favorite partner
  // ==========
  @UseGuards(JwtAccessTokenGuard)
  @Get('favorite')
  async getMyFavorite(
    @Query() pageOptionsDto: FilterUserActionDto,
    @Req() req,
  ) {
    const { user } = req;
    return await this._partnerService.getAction(
      user.id,
      pageOptionsDto,
      USER_ACTION_TYPE.FAVORITE,
    );
  }
  // ==========
  // list favorite partner
  // ==========
  // ==========
  // favorite to partner
  // ==========
  @UseGuards(JwtAccessTokenGuard)
  @Post('favorite/:id')
  async favoriteToPartner(@Param('id') id: string, @Req() req) {
    const { user } = req;
    return await this._partnerService.favorite(user, Number(id));
  }
  // ==========
  // favorite to partner
  // ==========

  // ==========
  // share to partner list
  // ==========
  @Get('share/:id')
  async getSharePartner(
    @Query() pageOptionsDto: FilterUserActionDto,
    @Param('id') id: string,
  ) {
    return await this._partnerService.getShare(Number(id), pageOptionsDto);
  }
  // ==========
  // share to partner list
  // ==========
  // ==========
  // share to partner
  // ==========
  @UseGuards(JwtAccessTokenGuard)
  @ApiBody({
    type: CreateShareDto,
    examples: {
      data: {
        value: {
          // partner A share partner B to partner C
          // fromUserId = B.id, toUserId = C.id
          fromUserId: 10,
          toUserId: 11,
        } as CreateShareDto,
      },
    },
  })
  @Post('share')
  async shareToPartner(@Body() body: CreateShareDto, @Req() req) {
    const { user } = req;
    return await this._partnerService.share(
      user,
      body.fromUserId,
      body.toUserId,
    );
  }
  // ==========
  // share to partner
  // ==========

  // ==========
  // view to partner
  // ==========
  @UseGuards(JwtAccessTokenGuard)
  @Post('view/:id')
  async viewToPartner(@Param('id') id: string, @Req() req) {
    const { user } = req;
    return await this._partnerService.otherAction(
      user,
      Number(id),
      USER_ACTION_TYPE.VIEW,
    );
  }
  // ==========
  // view to partner
  // ==========
  // ==========
  // view to partner list
  // ==========
  @Get('view/:id')
  async getViewPartner(
    @Query() pageOptionsDto: FilterUserActionDto,
    @Param('id') id: string,
  ) {
    return await this._partnerService.getAction(
      Number(id),
      pageOptionsDto,
      USER_ACTION_TYPE.VIEW,
    );
  }
  // ==========
  // view to partner list
  // ==========

  // ==========
  // research partner
  // ==========
  @UseGuards(JwtAccessTokenGuard)
  @Post('search/:id')
  async searchToPartner(@Param('id') id: string, @Req() req) {
    const { user } = req;
    return await this._partnerService.otherAction(
      user,
      Number(id),
      USER_ACTION_TYPE.SEARCH,
    );
  }
  // ==========
  // research partner
  // ==========
  // ==========
  // search to partner list
  // ==========
  @Get('search/:id')
  async getSearchPartner(
    @Query() pageOptionsDto: FilterUserActionDto,
    @Param('id') id: string,
  ) {
    return await this._partnerService.getAction(
      Number(id),
      pageOptionsDto,
      USER_ACTION_TYPE.SEARCH,
    );
  }
  // ==========
  // search to partner list
  // ==========

  // ==========
  // rate to partner list
  // ==========
  @Get('rate/:id')
  async getRatePartner(
    @Query() pageOptionsDto: FilterUserActionDto,
    @Param('id') id: string,
  ) {
    return await this._partnerService.getAction(
      Number(id),
      pageOptionsDto,
      USER_ACTION_TYPE.RATE,
    );
  }
  // ==========
  // rate to partner list
  // ==========
  // ==========
  // rating to partner
  // ==========
  @UseGuards(JwtAccessTokenGuard)
  @ApiBody({
    type: CreateRateDto,
    examples: {
      data: {
        value: {
          // Partner A post rate to Partner B:
          // content: note text content, value: rating value (1->5, step: 0.5)
          // toUserId = B.id
          content: `Tất cả đều tạo ra nội dung chất lượng cao. Đại diện công ty cũng gặp   trực tiếp các nhiếp ảnh gia truyền cảm hứng nếu họ thích danh mục đầu tư của họ.`,
          value: 4.5,
          toUserId: 10,
        } as CreateRateDto,
      },
    },
  })
  @Post('rate')
  async rateToPartner(@Body() payload: CreateRateDto, @Req() req) {
    const { user } = req;
    return await this._partnerService.rate(user, payload.toUserId, {
      content: payload.content,
      value: payload.value,
    });
  }
  // ==========
  // rating to partner
  // ==========

  // ==========
  // delete rate partner
  // ==========
  @UseGuards(JwtAccessTokenGuard, RolesGuard)
  @Roles(USER_ROLE.ENTERPRISE, USER_ROLE.USER)
  @Delete('rate/:id')
  async deleteRate(@Param('id') id: string, @Req() req) {
    const { user } = req;
    return await this._partnerService.deleteRate(user, Number(id));
  }
  // ==========
  // delete rate partner
  // ==========

  // ==========
  // update rate partner
  // ==========
  @UseGuards(JwtAccessTokenGuard, RolesGuard)
  @Roles(USER_ROLE.ENTERPRISE, USER_ROLE.USER)
  @ApiBody({
    type: UpdateRateDto,
    examples: {
      user: {
        value: {
          // update payload:
          // content is note text to content.
          // value is rating star (1->5, step 0.5)
          content: `Tất cả đều tạo ra nội dung chất lượng cao. Đại diện công ty cũng gặp   trực tiếp các nhiếp ảnh gia truyền cảm hứng nếu họ thích danh mục đầu tư của họ.`,
          value: 5,
        } as UpdateRateDto,
      },
    },
  })
  @Put('rate/:id')
  async updateRate(
    @Param('id') id: string,
    @Body() payload: UpdateRateDto,
    @Req() req,
  ) {
    const { user } = req;
    return await this._partnerService.updateRate(user, Number(id), payload);
  }
  // ==========
  // post new contact
  // ==========
  @UseGuards(JwtAccessTokenGuard, RolesGuard)
  @Roles(USER_ROLE.ENTERPRISE, USER_ROLE.USER)
  @ApiBody({
    type: CreateContactDto,
    examples: {
      data: {
        value: {
          toUserId: 2,
          name: 'Công ty TT Kỷ Nguyên Số',
          phone: '+84 564310015',
          note: `Lorem ipsum dolor sit amet consectetur. Nibh neque facilisis risus semper. Vulputate auctor integer pulvinar varius a maecenas porta lectus. Dui proin purus volutpat non leo amet aliquam lorem imperdiet`,
        } as CreateContactDto,
      },
    },
  })
  @Post('contact')
  async contactPartner(@Body() payload: CreateContactDto, @Req() req) {
    const { user } = req;
    return await this._partnerService.createContact(user, payload);
  }
  // ==========
  //  post new contact
  // ==========
  // ==========
  // get contact list
  // ==========
  @UseGuards(JwtAccessTokenGuard, RolesGuard)
  @Roles(USER_ROLE.ENTERPRISE, USER_ROLE.USER)
  @Get('contact')
  async getContacts(@Query() pageOptionsDto: FilterUserContactDto, @Req() req) {
    const { user } = req;
    return await this._partnerService.getContacts(user.id, pageOptionsDto);
  }
  // ==========
  // get contact list
  // ==========
}

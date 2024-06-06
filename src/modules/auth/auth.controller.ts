import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RequestWithUser } from 'src/base/types/requests.type';
import { IAuthService } from 'src/modules/auth/services/auth.service.interface';
import { SignInDto } from 'src/modules/auth/dto/sign-in.dto';
import { JwtRefreshTokenGuard } from 'src/modules/auth/guards/jwt-refresh-token.guard';
import { LocalAuthGuard } from 'src/modules/auth/guards/local.guard';
import { JwtAccessTokenGuard } from './guards/jwt-access-token.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly _authService: IAuthService) {}
  // ==========
  // Sign In
  // ==========
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  @ApiBody({
    type: SignInDto,
    examples: {
      user: {
        value: {
          email: 'admin@myzens.net',
          password: '12345678',
        } as SignInDto,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'Wrong credentials!!',
          error: 'Bad Request',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'success',
    content: {
      'application/json': {
        example: {
          accessToken:
            'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTYsImlhdCI6MTcxNzY0Mjg0NywiZXhwIjoxNzIxMjQyODQ3fQ.PBZNOPIlmIxfhTrRMHyddfGqkTzSVexMiYMi6U1uYFITBrzUk7DeChE9r7TGXx5R1AlYvSqWd70DbE22o0YzVsdfa_qvr1GS1rZ-bD8grj4Sdh-VUFI28Pv4q6hQoGNI6-ze3MxUpWiNKXEjFSBgke4rqAOVnLJQyflQnFybTZ9NVKbLOCHOaGL-Gs_9Lmv1ZYuediop5G4Ec4QqT4Dm04C6ncXuftOr4vm6T3o68DmGj4Tv18h7_eNLQXIepgH8mqaOrccyiXyOAUNrKk_B7RLubfQA-QnPKEnEWpoeFtj_g3B1CtJ11WBlg_L7RjT4A7uaTqdqehOI5uXM6sbjzg',
          refreshToken:
            'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTYsImlhdCI6MTcxNzY0Mjg0NywiZXhwIjoxODA0MDQyODQ3fQ.Ft4Qed85ujtBd980ofh6A_O1dOSOExnuYT4cELaAOj3qOpNi-37TyiUUcYbsjpHq2NVAwOuwk4vParwlONSceVMhKy_WQva1aYmri-2w1qJLfet3e1AmKe3X6sF4x93L6xmYI0IPblgmJscVM60kuZO_yLKIritDONZCJ0Z6tX6cxeNnr7KCrAYyCZ6XPdHTnPzDs1IfqZFSYErxtmlHeXH1Yng4d7S4Xoo981P0JWQXx2sRkIDDZkUJ7KN6uO-EUo9yTB71VClY1NJAnN0XUN6Zi7S976CPCs5XKwuDJEAxmxdA2YleDXXdlFkf7QZ7JhrembE0ad0eGbOEzNnZlQ',
        },
      },
    },
  })
  async signIn(@Req() request: RequestWithUser) {
    const { user } = request;
    return await this._authService.signIn(user.id);
  }

  // ==========
  // Get info
  // ==========
  @UseGuards(JwtAccessTokenGuard)
  @Post('get-info')
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'Wrong credentials!!',
          error: 'Bad Request',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'success',
    content: {
      'application/json': {
        example: {
          id: 1,
          createdDate: '2024-06-04T02:16:42.000Z',
          email: 'useraccount@myzens.net',
          address: '',
          job: '',
          roleId: '',
          imageUrl: '',
          phoneNumber: '+84361111111',
          referralID: '',
          emailVerified: false,
        },
      },
    },
  })
  async getInfo(@Req() request: RequestWithUser) {
    const { user } = request;
    return await this._authService.getInfo(user.id);
  }
  // ==========
  // Get info
  // ==========

  // ==========
  // refreshToken
  // ==========

  @UseGuards(JwtRefreshTokenGuard)
  @Post('refresh')
  async refreshAccessToken(@Req() request: RequestWithUser) {
    const { user } = request;
    const accessToken = await this._authService.generateAccessToken({
      id: user.id,
    });
    return {
      accessToken,
    };
  }
  // ==========
  // refreshToken
  // ==========
}

import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RequestWithUser } from 'src/base/types/requests.type';
import { IAuthService } from 'src/modules/auth/services/auth.service.interface';
import { SignInDto } from 'src/modules/auth/dto/sign-in.dto';
import { JwtRefreshTokenGuard } from 'src/modules/auth/guards/jwt-refresh-token.guard';
import { LocalAuthGuard } from 'src/modules/auth/guards/local.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly _authService: IAuthService) {}

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
  async signIn(@Req() request: RequestWithUser) {
    const { user } = request;
    return await this._authService.signIn(user.id);
  }

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
}

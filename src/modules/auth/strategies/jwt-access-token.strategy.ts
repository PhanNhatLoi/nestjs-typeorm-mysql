import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '@modules/auth/interfaces/token.interface';
import { access_token_public_key } from 'src/shared/constants/jwt.constaint';
import { IUserAccountService } from 'src/modules/user-account/services/user-account.service.interface';

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly _userService: IUserAccountService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: access_token_public_key,
    });
  }

  async validate(payload: TokenPayload) {
    const user = await this._userService.get(payload.id);
    if (!user.response?.isLoggedIn) {
      throw new UnauthorizedException();
    }
    return user.response;
  }
}

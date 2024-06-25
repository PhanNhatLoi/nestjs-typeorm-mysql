import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient();
    const authToken = client.handshake.headers.authorization?.split(' ')[1];

    if (!authToken) {
      throw new WsException('Unauthorized');
    }

    try {
      const payload = this.jwtService.verify(authToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      context.switchToHttp().getRequest().user = payload;
      return true;
    } catch (error) {
      throw new WsException('Unauthorized');
    }
  }
}

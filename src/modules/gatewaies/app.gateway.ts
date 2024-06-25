import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { JwtServiceConfig } from 'src/configs/config.interface';
import { ConfigService } from '@nestjs/config';
import { IUserAccountService } from '@modules/user-account/services/user-account.service.interface';
import { JwtAccessTokenGuard } from '@modules/auth/guards/jwt-access-token.guard';
import { WsJwtGuard } from './guards/validation';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  constructor(private readonly _userAccountService: IUserAccountService) {}

  @SubscribeMessage('messageToServer')
  handleMessage(
    client: Socket,
    payload: { sender: string; message: string },
  ): void {
    this.server.emit('messageToClient', payload);
  }

  afterInit(server: Server) {
    console.log('Init');
  }
  @UseGuards(WsJwtGuard)
  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
}

import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { JwtWsGuard } from 'src/guards/socket-jwt-auth.guard';
import { SocketService } from './socket.service';
import { UseGuards } from '@nestjs/common';

@WebSocketGateway({ cors: true })
export class SocketGateway implements OnGatewayConnection {
  @WebSocketServer()
  private server: Socket;

  constructor(private readonly socketService: SocketService) {}

  @UseGuards(JwtWsGuard)
  handleConnection(socket: Socket): void {
    this.socketService.handleConnection(socket);
  }

  handleDisconnect(client: Socket) {}

  // Implement other Socket.IO event handlers and message handlers
}

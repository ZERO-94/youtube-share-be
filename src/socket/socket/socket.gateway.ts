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
    console.log('Client connected:', socket.id);
    this.socketService.handleConnection(socket);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  // Implement other Socket.IO event handlers and message handlers
}

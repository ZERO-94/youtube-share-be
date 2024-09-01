import { Module } from '@nestjs/common';
import { SocketGateway } from './socket/socket.gateway';
import { SocketService } from './socket/socket.service';

@Module({
  providers: [SocketGateway, SocketService],
})
export class SocketModule {}

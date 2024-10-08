import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class SocketService {
  private readonly connectedClients: Map<string, Socket> = new Map();

  handleConnection(socket: Socket): void {
    const clientId = socket.id;
    this.connectedClients.set(clientId, socket);

    socket.on('disconnect', () => {
      this.connectedClients.delete(clientId);
    });

    // Handle other events and messages from the client
  }

  handleEvent(event: string, data: any): void {
    console.log(`Received event: ${data}`);
  }

  sendMessageToAll(event: string, data: any): void {
    this.connectedClients.forEach((socket) => {
      socket.emit(event, data);
    });
  }

  // Add more methods for handling events, messages, etc.
}

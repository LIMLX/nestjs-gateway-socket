import { Inject, Injectable } from '@nestjs/common';
import { UsersGateway } from './users.websocket'
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@Injectable()
export class AppService {
  constructor(private readonly socketService: UsersGateway) { }
  async getHello() {
    this.socketService.server.emit('message', "Hello from")
    return 'Users Hello World!';
  }
}

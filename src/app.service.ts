import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { io } from 'socket.io-client'

@Injectable()
export class AppService {
  constructor(
    @Inject("users") private readonly clientServiceA: ClientProxy,
  ) { }

  async getHello(): Promise<any> {
    const pattern = { cmd: "user" };
    const payload = { name: "demo" };

    return this.clientServiceA.send<any>(pattern, payload)
  }

}

@Injectable()
@WebSocketGateway(3002)
export class AppGateway implements OnGatewayConnection {
  userClient: any
  connectedClients = 0; // 记录当前连接数量
  @WebSocketServer() server: Server;
  constructor() { }

  async handleConnection(client: Socket, service: string) {
    this.userClient = io('http://localhost:3001')
    this.connectedClients++
  }

  async handleDisconnect(client: Socket) {
    this.connectedClients--; // 减少连接数量
    if (this.connectedClients <= 0) {
      this.userClient.disconnect();
      console.log("连接关闭")
    } else {
      console.log(`退出连接，当前连接人数:${this.connectedClients}`)
    }
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): void {
    this.userClient.emit("message", payload)
    this.server.emit('message', payload);
  }
}
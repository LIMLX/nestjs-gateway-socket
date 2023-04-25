import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { join } from 'path';
import { Server, Socket } from 'socket.io';
import { io } from 'socket.io-client'
import * as fs from 'fs'

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


@WebSocketGateway(3002, {
  key: fs.readFileSync(join(__dirname, "../../server/key.pem")),
  cert: fs.readFileSync(join(__dirname, '../../server/cert.pem'))
})
export class AppGateway implements OnGatewayConnection {
  userClient: any
  connectedClients = 0; // 记录当前连接数量
  @WebSocketServer() server: Server;
  constructor() { }

  // 连接
  async handleConnection(client: Socket, service: string) {
    this.userClient = io('http://localhost:3001')
    this.connectedClients++
  }

  // 记录断开连接人
  async handleDisconnect(client: Socket) {
    this.connectedClients--; // 减少连接数量
    if (this.connectedClients <= 0) {
      this.userClient.disconnect();
      console.log("连接关闭")
    } else {
      console.log(`退出连接，当前连接人数:${this.connectedClients}`)
    }
  }

  // 接收信息
  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): void {
    // 发送给user微服务的socket
    this.userClient.off('message');
    this.userClient.emit("message", payload)
    this.userClient.on('message', (data) => {
      this.server.emit('message', data);
    })
  }
}
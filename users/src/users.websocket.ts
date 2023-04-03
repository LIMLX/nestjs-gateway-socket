import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway(3001)
export class UsersGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() server: Server;

    handleConnection(client: Socket) {
        const ip = client.conn.remoteAddress;
        console.log(ip)
        // 客户端连接事件
        console.log('客户端连接id ： ' + client.id);
    }

    handleDisconnect(client: Socket) {
        // 客户端断开连接事件
        console.log('断开id: ' + client.id);
    }

    afterInit(server: Server) {
        // WebSocket服务器初始化事件
        console.log('socket用户初始化');
    }

    @SubscribeMessage('message')
    handleMessage(client: Socket, payload: any): void {
        console.log(`message: ${payload}`);
        this.server.emit('message', payload);
    }
}

import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { EventService } from './event.service';
import { Server, Socket } from 'socket.io';
import { Observable, from, map } from 'rxjs';

@WebSocketGateway({ namespace: 'chats' })
//@WebSocketGateway(81, { transports: ['websocket'] })
export class EventGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly eventService: EventService) {}

  @WebSocketServer()
  server: Server;

  //해당 gateway가 실행되면 가장먼저 실행되는 함수
  afterInit(server: any) {
    console.log('서버실행', server);
  }

  connectedClients: { [socketId: string]: boolean } = {};
  clientNickname: { [socketId: string]: string } = {};
  roomUsers: { [key: string]: string[] } = {};

  //연결이되면 실행되는 함수
  handleConnection(client: Socket): void {
    // if (this.connectedClients[client.id]) {
    //   client.disconnect(true);
    //   return;
    // }
    console.log('연결완료');

    this.connectedClients[client.id] = true;
  }

  //연결이끝나면 실행되는 함수
  handleDisconnect(client: Socket): void {
    delete this.connectedClients[client.id];

    console.log('연결종료');
    // 클라이언트 연결이 종료되면 해당 클라이언트가 속한 모든 방에서 유저를 제거
    Object.keys(this.roomUsers).forEach((room) => {
      const index = this.roomUsers[room]?.indexOf(
        this.clientNickname[client.id],
      );
      if (index !== -1) {
        this.roomUsers[room].splice(index, 1);
        this.server
          .to(room)
          .emit('userLeft', { userId: this.clientNickname[client.id], room });
        this.server
          .to(room)
          .emit('userList', { room, userList: this.roomUsers[room] });
      }
    });
    console.log(this.roomUsers);

    // 모든 방의 유저 목록을 업데이트하여 emit
    Object.keys(this.roomUsers).forEach((room) => {
      this.server
        .to(room)
        .emit('userList', { room, userList: this.roomUsers[room] });
    });

    // 연결된 클라이언트 목록을 업데이트하여 emit
    this.server.emit('userList', {
      room: null,
      userList: Object.keys(this.connectedClients),
    });
  }

  //@UseFilters(new WsExceptionFilter())
  @SubscribeMessage('events')
  // handleEvent(client: Socket, data: string): string {
  //   return data;
  async handleEvent(
    @MessageBody() message: string,
    // @ConnectedSocket() client: Socket,
  ) {
    //   console.log(data);
    //  console.log(client);
    //   console.log(1);
    //   await client.emit('response', 'Message received successfully');
    console.log(message);
    this.server.emit('message', message);

    // this.server.to(data).emit('chatMessage', {
    //   userId: this.clientNickname[client.id],
    // });

    // You can return a response if needed
    //  return { event: 'events', data: 1 };
    // return from([1, 2, 3]).pipe(
    //   map((item) => ({ event: 'events', data: item })),
    // );
  }

  @SubscribeMessage('events2')
  onEvent(client: any, data: any): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: 'events', data: item })),
    );
  }
}

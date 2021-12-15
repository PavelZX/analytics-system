import {
  forwardRef,
  Inject,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ExceptionsFilter } from '../../../core/filter/exceptions.filter';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { ChannelService } from '../service/channel.service';

@UsePipes(new ValidationPipe())
@UseFilters(new ExceptionsFilter())
@UseGuards(JwtAuthGuard)
@WebSocketGateway()
export class ChannelGateway implements OnGatewayDisconnect<Socket> {
  @WebSocketServer() server: Server;

  constructor(
    @Inject(forwardRef(() => ChannelService)) private channelService: ChannelService,
  ) {}

  handleDisconnect(socket: Socket) {
    this.channelService.unsubscribeSocket(socket);
  }

  @SubscribeMessage('channel:subscribe')
  async subscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() channelId: string,
  ) {
    return this.channelService.subscribeSocket(
      client,
      await this.channelService.validateChannel(channelId),
    );
  }
}

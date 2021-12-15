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
import { AdvertisingService } from '../service/advertising.service';

@UsePipes(new ValidationPipe())
@UseFilters(new ExceptionsFilter())
@UseGuards(JwtAuthGuard)
@WebSocketGateway()
export class AdvertisingGateway implements OnGatewayDisconnect<Socket> {
  @WebSocketServer() server: Server;

  constructor(
    @Inject(forwardRef(() => AdvertisingService)) private advertisingService: AdvertisingService,
  ) {}

  handleDisconnect(socket: Socket) {
    this.advertisingService.unsubscribeSocket(socket);
  }

  @SubscribeMessage('advertising:subscribe')
  async subscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() advertisingId: string,
  ) {
    return this.advertisingService.subscribeSocket(
      client,
      await this.advertisingService.validateAdvertising(advertisingId),
    );
  }
}

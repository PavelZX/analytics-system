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
import { OrganizationService } from '../service/organization.service';

@UsePipes(new ValidationPipe())
@UseFilters(new ExceptionsFilter())
@UseGuards(JwtAuthGuard)
@WebSocketGateway()
export class OrganizationGateway implements OnGatewayDisconnect<Socket> {
  @WebSocketServer() server: Server;

  constructor(
    @Inject(forwardRef(() => OrganizationService)) private organizationService: OrganizationService,
  ) {}

  handleDisconnect(socket: Socket) {
    this.organizationService.unsubscribeSocket(socket);
  }

  @SubscribeMessage('organization:subscribe')
  async subscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() organizationId: string,
  ) {
    return this.organizationService.subscribeSocket(
      client,
      await this.organizationService.validateOrganization(organizationId),
    );
  }
}

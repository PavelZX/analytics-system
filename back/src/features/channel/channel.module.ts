import { ChannelService } from './service/channel.service';
import { ChannelController } from './controller/channel.controller';

import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Channel, ChannelSchema } from './schema/channel.schema';
import { AuthModule } from '../auth/auth.module';
import { ChannelGateway } from './gateway/channel.gateway';
import { MessagesModule } from '../messages/messages.module';
import { SharedModule } from '../../shared/shared.module';

@Module({
  imports: [
    AuthModule,
    forwardRef(() => MessagesModule),
    MongooseModule.forFeature([
      {
        name: Channel.name,
        schema: ChannelSchema,
      },
    ]),
    SharedModule,
  ],
  controllers: [ChannelController],
  providers: [ChannelService, ChannelGateway],
  exports: [ChannelService, ChannelGateway],
})
export class ChannelModule {}

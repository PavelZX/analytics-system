import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MessagesModule } from './messages/messages.module';
import { NotificationModule } from './notification/notification.module';
import { RoomModule } from './room/room.module';
import { OrganizationModule } from './organization/organization.module';
import { AdvertisingModule } from './advertising/advertising.module';
import { ChannelModule } from './channel/channel.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    RoomModule,
    OrganizationModule,
    AdvertisingModule,
    ChannelModule,
    MessagesModule,
    NotificationModule,
  ],
  controllers: [],
  exports: [
    AuthModule,
    UserModule,
    RoomModule,
    OrganizationModule,
    AdvertisingModule,
    ChannelModule,
    MessagesModule,
    NotificationModule,
  ],
})
export class FeaturesModule {}

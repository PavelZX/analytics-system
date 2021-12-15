import { AdvertisingService } from './service/advertising.service';
import { AdvertisingController } from './controller/advertising.controller';

import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Advertising, AdvertisingSchema } from './schema/advertising.schema';
import { AuthModule } from '../auth/auth.module';
import { AdvertisingGateway } from './gateway/advertising.gateway';
import { MessagesModule } from '../messages/messages.module';
import { SharedModule } from '../../shared/shared.module';

@Module({
  imports: [
    AuthModule,
    forwardRef(() => MessagesModule),
    MongooseModule.forFeature([
      {
        name: Advertising.name,
        schema: AdvertisingSchema,
      },
    ]),
    SharedModule,
  ],
  controllers: [AdvertisingController],
  providers: [AdvertisingService, AdvertisingGateway],
  exports: [AdvertisingService, AdvertisingGateway],
})
export class AdvertisingModule {}

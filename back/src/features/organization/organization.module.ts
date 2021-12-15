import { OrganizationService } from './service/organization.service';
import { OrganizationController } from './controller/organization.controller';

import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Organization, OrganizationSchema } from './schema/organization.schema';
import { AuthModule } from '../auth/auth.module';
import { OrganizationGateway } from './gateway/organization.gateway';
import { MessagesModule } from '../messages/messages.module';
import { SharedModule } from '../../shared/shared.module';

@Module({
  imports: [
    AuthModule,
    forwardRef(() => MessagesModule),
    MongooseModule.forFeature([
      {
        name: Organization.name,
        schema: OrganizationSchema,
      },
    ]),
    SharedModule,
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService, OrganizationGateway],
  exports: [OrganizationService, OrganizationGateway],
})
export class OrganizationModule {}

import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Channel } from 'src/features/channel/schema/channel.schema';
import { Organization } from 'src/features/organization/schema/organization.schema';
import { createSchemaForClassWithMethods } from '../../../shared/mongoose/create-schema';
import { ObjectId } from '../../../shared/mongoose/object-id';
import { User } from '../../user/schema/user.schema';

@Schema()
export class Advertising extends Document {
  @Prop({
    required: true,
  })
  title: string;

  @Prop({
    required: true,
  })
  description: string;

  @Prop({ type: ObjectId, ref: Organization.name })
  static owner: Organization;

  @Prop({ type: [{ type: ObjectId, ref: Channel.name }] })
  channels: Channel[];

  @Prop({
    required: true,
  })
  isActive: boolean;
}

export const AdvertisingSchema = createSchemaForClassWithMethods(Advertising);

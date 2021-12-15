import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { createSchemaForClassWithMethods } from '../../../shared/mongoose/create-schema';
import { ObjectId } from '../../../shared/mongoose/object-id';
import { User } from '../../user/schema/user.schema';

@Schema()
export class Organization extends Document {
  @Prop({
    required: true,
  })
  title: string;

  @Prop({
    required: true,
  })
  description: string;

  @Prop({ type: [{ type: ObjectId, ref: User.name }] })
  members: User[];

  @Prop({
    required: true,
  })
  balance: string;

  @Prop({
    required: true,
  })
  isActive: boolean;
}

export const OrganizationSchema = createSchemaForClassWithMethods(Organization);

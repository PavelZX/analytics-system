import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { createSchemaForClassWithMethods } from '../../../shared/mongoose/create-schema';

@Schema()
export class Channel extends Document {
  @Prop({
    required: true,
  })
  title: string;

  @Prop({
    required: true,
  })
  description: string;

  @Prop({
    required: true,
  })
  balance: string;

  @Prop({
    required: true,
  })
  isActive: boolean;
}

export const ChannelSchema = createSchemaForClassWithMethods(Channel);

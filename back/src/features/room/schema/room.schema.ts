import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Advertising } from 'src/features/advertising/schema/advertising.schema';
import { createSchemaForClassWithMethods } from '../../../shared/mongoose/create-schema';
import { ObjectId } from '../../../shared/mongoose/object-id';
import { User } from '../../user/schema/user.schema';

@Schema()
export class Room extends Document {
  @Prop({
    required: true,
  })
  title: string;

  @Prop({ type: [{ type: ObjectId, ref: User.name }] })
  members: User[];

  @Prop({ type: ObjectId, ref: Advertising.name })
  advertising: Advertising;

  @Prop({
    required: true,
  })
  isPublic: boolean;
}

export const RoomSchema = createSchemaForClassWithMethods(Room);

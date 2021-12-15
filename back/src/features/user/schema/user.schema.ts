import * as bcrypt from 'bcrypt';
import { Prop, Schema } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RoleEntity } from '../../role/role.schema';
import { createSchemaForClassWithMethods } from '../../../shared/mongoose/create-schema';
import { randomString } from '../../../shared/utils/random-string';
import { Organization } from 'src/features/organization/schema/organization.schema';

@Schema()
export class User extends Document {
  @Prop({
    required: true,
    index: true,
    lowercase: true,
    trim: true
  })
  firstName: string;

  @Prop({
      required: false,
      index: true,
      lowercase: true,
      trim: true
  })
  lastName?: string;

  @Prop({
      required: true,
      index: true,
      unique: true,
      trim: true
  })
  mobileNumber: string;

  @Prop()
  email: string;

  @Prop({
    default: "guest",
    type: Types.ObjectId,
    ref: RoleEntity.name
  })
  role: Types.ObjectId;

  @Prop()
  sessionToken: string;

  @Prop({ default: false })
  online: boolean;

  @Prop()
  password?: string;

  @Prop()
  facebookId?: string;

  @Prop()
  googleId?: string;

  @Prop()
  appleId?: string;

  get isSocial(): boolean {
    return !!(this.facebookId || this.googleId || this.appleId);
  }

  generateSessionToken() {
    this.sessionToken = randomString(60);
  }

  validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password || '');
  }
}

export const UserSchema = createSchemaForClassWithMethods(User);

// Update password into a hashed one.
UserSchema.pre('save', async function(next) {
  const user: User = this as any;

  if (!user.password || user.password.startsWith('$')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt();

    user.password = await bcrypt.hash(user.password, salt);

    next();
  } catch (e) {
    next(e);
  }
});

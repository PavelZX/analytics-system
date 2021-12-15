import { User } from './schema/user.schema';
import { Document } from 'mongoose';
import { IRoleDocument } from '../role/role.interface';

export type UserDocument = User & Document;

export interface IUserDocument extends Omit<UserDocument, 'role'> {
    role: IRoleDocument;
}

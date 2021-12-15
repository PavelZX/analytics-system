import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { ObjectId } from 'mongodb';
import { User } from '../schema/user.schema';
import { randomString } from '../../../shared/utils/random-string';
import { UserGateway } from '../gateway/user.gateway';
import { Socket } from 'socket.io';
import { SocketConnectionService } from './socket-connection.service';
import { UserDocument, IUserDocument } from '../../user/user.interface';
import { RoleEntity } from '../../role/role.schema';
import { PermissionEntity } from '../../permission/permission.schema';
import { Types } from 'mongoose';
import { UserProfileTransformer } from '../transformer/user.profile.transformer';
import { plainToClass } from 'class-transformer';
import { UserLoginTransformer } from '../transformer/user.login.transformer';
import { Helper } from '../../helper/helper.decorator';
import { HelperService } from '../../helper/helper.service';

@Injectable()
export class UserService {
  private blockedFields: (keyof User)[] = [
    'password',
    'sessionToken',
    'email',
    'facebookId',
    'googleId',
    'appleId',
  ];

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(forwardRef(() => UserGateway)) private userGateway: UserGateway,
    private socketConnectionService: SocketConnectionService,
    @Helper() private readonly helperService: HelperService,
  ) {}

  getUserByName(name: string) {
    const firstName = { $regex: new RegExp(`^${name}$`, 'i') };

    return this.userModel.findOne({ firstName });
  }

  async validateUserByName(firstName: string) {
    const user = await this.getUserByName(firstName);

    if (!user) {
      throw new NotFoundException('Нет такого пользователя');
    }

    return user;
  }

  getUserByMobileNumber(number: string) {
    const mobileNumber = { $regex: new RegExp(`^${number}$`, 'i') };

    return this.userModel.findOne({ mobileNumber });
  }

  async validateUserByMobileNumber(mobileNumber: string) {
    const user = await this.getUserByMobileNumber(mobileNumber);

    if (!user) {
      throw new NotFoundException('Нет такого пользователя');
    }

    return user;
  }

  getUserByEmail(mail: string) {
    const email = { $regex: new RegExp(`^${mail}$`, 'i') };

    return this.userModel.findOne({ email });
  }

  async validateUserByEmail(email: string) {
    const user = await this.getUserByEmail(email);

    if (!user) {
      throw new NotFoundException('Нет такого пользователя');
    }

    return user;
  }

  getUserBy(filter: FilterQuery<User>) {
    return this.userModel.findOne(filter);
  }

  getUserByGoogleId(id: string) {
    return this.userModel.findOne({ googleId: id });
  }

  getUserById(id: ObjectId | string) {
    return this.userModel.findById(id);
  }

  async validateUserById(id: string) {
    const user = await this.getUserById(id);

    if (!user) {
      throw new NotFoundException('Нет такого пользователя');
    }

    return user;
  }

  async getOnlineUsers() {
    return this.userModel.find({ online: true });
  }

  async getUsers(): Promise<User[]> {
    const users = await this.userModel.find().exec();
    return users;
  }

  deleteUser(user: User) {
    this.handleDeleteUser(user);

    return Promise.all([
      this.userModel.findOneAndDelete({ _id: user._id })
    ]);
  }

  handleDeleteUser(user: User) {
    this.sendMessage(user, 'user:delete', user);
  }

  async subscribeSocket(socket: Socket, user: User) {
    await this.socketConnectionService.create(socket, user);

    return socket.join(`user_${user._id}`);
  }

  async unsubscribeSocket(socket: Socket, user: User) {
    await this.socketConnectionService.delete(socket);

    return socket.leave(`user_${user._id}`);
  }

  sendMessage<T>(user: User, event: string, message?: T) {
    return this.userGateway.server.to(`user_${user._id}`).emit(event, message);
  }

  sendMessageExcept<T>(except: Socket, user: User, event: string, message: T) {
    return except.broadcast.to(`user_${user._id}`).emit(event, message);
  }

  async generateUsername(base: string) {
    const name = base.replace(/\s/g, '');

    if (!(await this.getUserByName(name))) {
      return name;
    }

    return this.generateUsername(name + randomString(6));
  }

  async getUser(firstName: string) {
    return (
      (await this.getUserByName(firstName)) ??
      (await this.getUserByEmail(firstName))
    );
  }

  updateUser(user: User, data: UpdateQuery<User>) {
    return this.userModel.findByIdAndUpdate(user._id, data);
  }

  filterUser(user: User, allowedFields: (keyof User)[] = []) {
    const userObject = user.toObject({ virtuals: true });

    for (const field of this.blockedFields) {
      if (allowedFields.includes(field)) {
        continue;
      }

      delete userObject[field];
    }

    return userObject;
  }

  async updateUserObject(user: User) {
    const newInput = await this.getUserById(user._id);

    return Object.assign(user, newInput);
  }

  async findAll<T>(
    find?: Record<string, any>,
    options?: Record<string, any>
): Promise<T[]> {
    const findAll = this.userModel
        .find(find)
        .select('-__v')
        .skip(options && options.skip ? options.skip : 0);

    if (options && options.limit) {
        findAll.limit(options.limit);
    }

    if (options && options.populate) {
        findAll.populate({
            path: 'role',
            model: RoleEntity.name,
            match: { isActive: true },
            populate: {
                path: 'permissions',
                model: PermissionEntity.name,
                match: { isActive: true }
            }
        });
    }

    return findAll.lean();
  }

  async totalData(find?: Record<string, any>): Promise<number> {
      return this.userModel.countDocuments(find);
  }

  async safeProfile(data: IUserDocument): Promise<Record<string, any>> {
      return plainToClass(UserProfileTransformer, data);
  }

  async safeLogin(data: IUserDocument): Promise<Record<string, any>> {
      return plainToClass(UserLoginTransformer, data);
  }

  async findOneById<T>(userId: string, populate?: boolean): Promise<T> {
      const user = this.userModel.findById(userId).select('-__v');

      if (populate) {
          user.populate({
              path: 'role',
              model: RoleEntity.name,
              match: { isActive: true },
              populate: {
                  path: 'permissions',
                  model: PermissionEntity.name,
                  match: { isActive: true }
              }
          });
      }

      return user.lean();
  }

  async findOne<T>(
      find?: Record<string, any>,
      populate?: boolean
  ): Promise<T> {
      const user = this.userModel.findOne(find).select('-__v');

      if (populate) {
          user.populate({
              path: 'role',
              match: { isActive: true },
              model: RoleEntity.name,
              populate: {
                  path: 'permissions',
                  match: { isActive: true },
                  model: PermissionEntity.name
              }
          });
      }

      return user.lean();
  }
  async create(body: Partial<User>) {
    const user = await this.userModel.create(body);

    user.generateSessionToken();

    return user.save();
  }

  // async create(data: Record<string, any>): Promise<UserDocument> {
  //     const salt: string = await this.helperService.randomSalt();
  //     const passwordHash = await this.helperService.bcryptHashPassword(
  //         data.password,
  //         salt
  //     );

  //     const newUser: UserEntity = {
  //         firstName: data.firstName.toLowerCase(),
  //         email: data.email.toLowerCase(),
  //         mobileNumber: data.mobileNumber,
  //         password: passwordHash,
  //         role: Types.ObjectId(data.role)
  //     };

  //     if (data.lastName) {
  //         newUser.lastName = data.lastName.toLowerCase();
  //     }

  //     const create: UserDocument = new this.userModel(newUser);
  //     return create.save();
  // }

  async deleteOneById(userId: string): Promise<boolean> {
      try {
          this.userModel.deleteOne({
              _id: userId
          });
          return true;
      } catch (e: unknown) {
          return false;
      }
  }

  // async updateOneById(
  //     userId: string,
  //     data: Record<string, any>
  // ): Promise<UserDocument> {
  //     return this.userModel.updateOne(
  //         {
  //             _id: userId
  //         },
  //         {
  //             firstName: data.firstName.toLowerCase(),
  //             lastName: data.lastName.toLowerCase()
  //         }
  //     );
  // }

  // async checkExist(
  //     email: string,
  //     mobileNumber: string,
  //     userId?: string
  // ): Promise<IErrors[]> {
  //     const existEmail: UserDocument = await this.userModel
  //         .findOne({
  //             email: email
  //         })
  //         .where('_id')
  //         .ne(userId)
  //         .lean();

  //     const existMobileNumber: UserDocument = await this.userModel
  //         .findOne({
  //             mobileNumber: mobileNumber
  //         })
  //         .where('_id')
  //         .ne(userId)
  //         .lean();

  //     const errors: IErrors[] = [];
  //     if (existEmail) {
  //         errors.push({
  //             message: this.messageService.get('user.error.emailExist'),
  //             property: 'email'
  //         });
  //     }
  //     if (existMobileNumber) {
  //         errors.push({
  //             message: this.messageService.get(
  //                 'user.error.mobileNumberExist'
  //             ),
  //             property: 'mobileNumber'
  //         });
  //     }

  //     return errors;
  // }

  // For migration
  async deleteMany(find: Record<string, any>): Promise<boolean> {
      try {
          await this.userModel.deleteMany(find);
          return true;
      } catch (e: unknown) {
          return false;
      }
  }
}

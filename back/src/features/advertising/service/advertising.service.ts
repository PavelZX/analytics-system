import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateQuery } from 'mongoose';
import { MessageService } from '../../messages/service/message.service';
import { AdvertisingDto } from '../dto/advertising.dto';
import { AdvertisingGateway } from '../gateway/advertising.gateway';
import { Advertising } from '../schema/advertising.schema';

@Injectable()
export class AdvertisingService {
  constructor(
    @InjectModel(Advertising.name) private advertisingModel: Model<Advertising>,
    private advertisingGateway: AdvertisingGateway,
    @Inject(forwardRef(() => MessageService))
    private messageService: MessageService,
  ) {}

  async create(advertising: AdvertisingDto) {
    const object = await this.advertisingModel.create({ ...advertising });
  }

  async update(advertising: Advertising, body: UpdateQuery<Advertising>) {
    this.handleUpdateAdvertising(advertising, body as Advertising);

    return this.advertisingModel
      .findOneAndUpdate({ _id: advertising._id }, body);
  }

  handleUpdateAdvertising(advertising: Advertising, body: Partial<Advertising>) {
    this.sendMessage(advertising, 'advertising:update', Object.assign(advertising, body));
  }

  delete(advertising: Advertising) {
    this.handleDeleteAdvertising(advertising);

    return Promise.all([
      this.advertisingModel.findOneAndDelete({ _id: advertising._id})
    ]);
  }

  handleDeleteAdvertising(advertising: Advertising) {
    this.sendMessage(advertising, 'advertising:delete', advertising);
  }

  getAdvertisingById(advertisingId: string) {
    return this.advertisingModel
      .findOne({ _id: advertisingId });
  }

  async getAdvertisings(): Promise<Advertising[]> {
    const advertisins = await this.advertisingModel.find().exec();
    return advertisins;
}

  async validateAdvertisingById(advertisingId: string) {
    const advertising = await this.getAdvertisingById(advertisingId);

    if (!advertising) {
      throw new NotFoundException('Advertising not found');
    }

    return advertising;
  }

  getAdvertising(advertisingId: string) {
    return this.advertisingModel
      .findById(advertisingId)
      .populate('owner', '-password -sessionToken');
  }

  async validateAdvertising(advertisingId: string) {
    const advertising = await this.getAdvertising(advertisingId);

    if (!advertising) {
      throw new NotFoundException('Advertising not found');
    }

    return advertising;
  }


  getActiveAdvertisings() {
    return this.advertisingModel
      .find({ isActive: true })
      .populate('owner', '-password -sessionToken');
  }

  sendMessage<T>(advertising: Advertising, event: string, message?: T) {
    return this.advertisingGateway.server.to(`advertising_${advertising._id}`).emit(event, message);
  }
}

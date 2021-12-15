import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateQuery } from 'mongoose';
import { MessageService } from '../../messages/service/message.service';
import { ChannelDto } from '../dto/channel.dto';
import { ChannelGateway } from '../gateway/channel.gateway';
import { Channel } from '../schema/channel.schema';

@Injectable()
export class ChannelService {
  constructor(
    @InjectModel(Channel.name) private channelModel: Model<Channel>,
    private channelGateway: ChannelGateway,
    @Inject(forwardRef(() => MessageService))
    private messageService: MessageService,
  ) {}

  async create(channel: ChannelDto) {
    const object = await this.channelModel.create({ ...channel });
  }

  async update(channel: Channel, body: UpdateQuery<Channel>) {
    this.handleUpdateChannel(channel, body as Channel);

    return this.channelModel
      .findOneAndUpdate({ _id: channel._id}, body);
  }

  handleUpdateChannel(channel: Channel, body: Partial<Channel>) {
    this.sendMessage(channel, 'channel:update', Object.assign(channel, body));
  }

  delete(channel: Channel) {
    this.handleDeleteChannel(channel);

    return Promise.all([
      this.channelModel.findOneAndDelete({ _id: channel._id })
    ]);
  }

  handleDeleteChannel(channel: Channel) {
    this.sendMessage(channel, 'channel:delete', channel);
  }

  getChannelById(channelId: string) {
    return this.channelModel
      .findOne({ _id: channelId })
  }

  async getChannels(): Promise<Channel[]> {
    const channels = await this.channelModel.find().exec();
    return channels;
}

  async validateChannelById(channelId: string) {
    const channel = await this.getChannelById(channelId);

    if (!channel) {
      throw new NotFoundException('Channel not found');
    }

    return channel;
  }

  getChannel(channelId: string) {
    return this.channelModel
      .findById(channelId)
      .populate('members', '-password -sessionToken');
  }

  async validateChannel(channelId: string) {
    const channel = await this.getChannel(channelId);

    if (!channel) {
      throw new NotFoundException('Channel not found');
    }

    return channel;
  }

  getActiveChannels() {
    return this.channelModel
      .find({ isActive: true });
  }

  sendMessage<T>(channel: Channel, event: string, message?: T) {
    return this.channelGateway.server.to(`channel_${channel._id}`).emit(event, message);
  }
}

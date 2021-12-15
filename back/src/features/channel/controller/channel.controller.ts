import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ParseObjectIdPipe } from '../../../shared/pipe/parse-object-id.pipe';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { ChannelDto } from '../dto/channel.dto';
import { ChannelService } from '../service/channel.service';

@UseGuards(JwtAuthGuard)
@Controller('channel')
export class ChannelController {
  constructor(private channelService: ChannelService) {}

  @Get('id/:id')
  get(@Param('id', ParseObjectIdPipe) id: string) {
    return this.channelService.getChannel(id);
  }

  @Get('active')
  getActiveChannels() {
    return this.channelService.getActiveChannels();
  }

  @Get('all')
  getChannels() {
    return this.channelService.getChannels();
  }

  @Delete('delete/:id')
  async delete(
    @Param('id', ParseObjectIdPipe) id: string,
  ) {
    return this.channelService.delete(
      await this.channelService.validateChannelById(id),
    );
  }

  @Post()
  async create(@Body() channel: ChannelDto) {
    return this.channelService.create(channel);
  }

  @Put(':id')
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() body: ChannelDto,
  ) {
    return this.channelService.update(
      await this.channelService.validateChannelById(id),
      body,
    );
  }
}

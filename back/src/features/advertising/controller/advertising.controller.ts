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
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { User } from '../../user/schema/user.schema';
import { AdvertisingDto } from '../dto/advertising.dto';
import { AdvertisingService } from '../service/advertising.service';

@UseGuards(JwtAuthGuard)
@Controller('advertising')
export class AdvertisingController {
  constructor(private advertisingService: AdvertisingService) {}

  @Get('id/:id')
  get(@Param('id', ParseObjectIdPipe) id: string) {
    return this.advertisingService.getAdvertising(id);
  }

  @Get('active')
  getActiveAdvertisings() {
    return this.advertisingService.getActiveAdvertisings();
  }

  @Get('all')
  getAdvertisings() {
    return this.advertisingService.getAdvertisings();
  }

  @Delete('delete/:id')
  async delete(
    @Param('id', ParseObjectIdPipe) id: string,
  ) {
    return this.advertisingService.delete(
      await this.advertisingService.validateAdvertisingById(id),
    );
  }

  @Post()
  async create(@Body() advertising: AdvertisingDto, @CurrentUser() user: User) {
    return this.advertisingService.create(advertising);
  }

  @Put(':id')
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() body: AdvertisingDto,
  ) {
    return this.advertisingService.update(
      await this.advertisingService.validateAdvertisingById(id),
      body,
    );
  }
}

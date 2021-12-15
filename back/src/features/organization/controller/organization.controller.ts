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
import { OrganizationDto } from '../dto/organization.dto';
import { OrganizationService } from '../service/organization.service';

@UseGuards(JwtAuthGuard)
@Controller('organization')
export class OrganizationController {
  constructor(private organizationService: OrganizationService) {}

  @Get('id/:id')
  get(@Param('id', ParseObjectIdPipe) id: string) {
    return this.organizationService.getOrganization(id);
  }

  @Get('active')
  getActiveOrganizations() {
    return this.organizationService.getActiveOrganizations();
  }

  @Get('all')
  getOrganizations() {
    return this.organizationService.getOrganizations();
  }

  @Delete('delete/:id')
  async delete(
    @Param('id', ParseObjectIdPipe) id: string,
  ) {
    return this.organizationService.delete(
      await this.organizationService.validateOrganizationById(id)
    );
  }

  @Post()
  async create(@Body() organization: OrganizationDto) {
    return this.organizationService.create(organization);
  }

  @Put(':id')
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() body: OrganizationDto,
  ) {
    return this.organizationService.update(
      await this.organizationService.validateOrganizationById(id),
      body,
    );
  }
}

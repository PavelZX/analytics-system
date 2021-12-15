import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateQuery } from 'mongoose';
import { MessageService } from '../../messages/service/message.service';
import { UserService } from '../../user/service/user.service';
import { OrganizationDto } from '../dto/organization.dto';
import { OrganizationGateway } from '../gateway/organization.gateway';
import { Organization } from '../schema/organization.schema';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(Organization.name) private organizationModel: Model<Organization>,
    private organizationGateway: OrganizationGateway,
    private userService: UserService,
    @Inject(forwardRef(() => MessageService))
    private messageService: MessageService,
  ) {}

  async create(organization: OrganizationDto) {
    const object = await this.organizationModel.create({ ...organization });
  }

  async update(organization: Organization, body: UpdateQuery<Organization>) {
    this.handleUpdateOrganization(organization, body as Organization);

    return this.organizationModel
      .findOneAndUpdate({ _id: organization._id }, body);
  }

  handleUpdateOrganization(organization: Organization, body: Partial<Organization>) {
    this.sendMessage(organization, 'organization:update', Object.assign(organization, body));
  }

  delete(organization: Organization) {
    this.handleDeleteOrganization(organization);

    return Promise.all([
      this.organizationModel.findOneAndDelete({ _id: organization._id })
    ]);
  }

  handleDeleteOrganization(organization: Organization) {
    this.sendMessage(organization, 'organization:delete', organization);
  }

  getOrganizationById(organizationId: string) {
    return this.organizationModel
      .findOne({ _id: organizationId })
  }

  async getOrganizations(): Promise<Organization[]> {
    const organizations = await this.organizationModel.find().exec();
    return organizations;
}

  async validateOrganizationById(organizationId: string) {
    const organization = await this.getOrganizationById(organizationId);

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return organization;
  }

  getOrganization(organizationId: string) {
    return this.organizationModel
      .findById(organizationId)
      .populate('members', '-password -sessionToken')
  }

  async validateOrganization(organizationId: string) {
    const organization = await this.getOrganization(organizationId);

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return organization;
  }

  getActiveOrganizations() {
    return this.organizationModel
      .find({ isActive: true });
  }

  sendMessage<T>(organization: Organization, event: string, message?: T) {
    return this.organizationGateway.server.to(`organization_${organization._id}`).emit(event, message);
  }
}

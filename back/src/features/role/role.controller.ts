import {
    Controller,
    Get,
    DefaultValuePipe,
    ParseIntPipe,
    Query
} from '@nestjs/common';
import { Response } from '../response/response.decorator';
import { AuthJwtGuard } from '../auth/decorators/auth.decorator';
import { ENUM_PERMISSIONS } from '../permission/permission.constant';
import { Permissions } from '../permission/permission.decorator';
import { RoleService } from './role.service';
import { PaginationService } from '../pagination/pagination.service';
import { Pagination } from '../pagination/pagination.decorator';
import { RoleDocument } from './role.interface';
import {
    DEFAULT_PAGE,
    DEFAULT_PER_PAGE
} from '../pagination/pagination.constant';
import { IResponsePaging } from '../response/response.interface';

@Controller('/role')
export class RoleController {
    constructor(
        @Pagination() private readonly paginationService: PaginationService,
        private readonly roleService: RoleService
    ) {}

    @Get('/')
    @AuthJwtGuard()
    @Response('role.findAll')
    @Permissions(ENUM_PERMISSIONS.ROLE_READ)
    async findAll(
        @Query('page', new DefaultValuePipe(DEFAULT_PAGE), ParseIntPipe)
        page: number,
        @Query('perPage', new DefaultValuePipe(DEFAULT_PER_PAGE), ParseIntPipe)
        perPage: number
    ): Promise<IResponsePaging> {
        const skip = await this.paginationService.skip(page, perPage);
        const roles: RoleDocument[] = await this.roleService.findAll<RoleDocument>(
            {},
            {
                skip: skip,
                limit: perPage
            }
        );

        const totalData: number = await this.roleService.totalData();
        const totalPage = await this.paginationService.totalPage(
            totalData,
            perPage
        );

        return {
            totalData,
            totalPage,
            currentPage: page,
            perPage,
            data: roles
        };
    }
}

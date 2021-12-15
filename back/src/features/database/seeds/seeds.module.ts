import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { PermissionModule } from '../../permission/permission.module';

import { PermissionSeed } from '../../database/seeds/permission.seed';
import { RoleSeed } from './role.seed';
import { RoleModule } from '../../role/role.module';
import { UserSeed } from './user.seed';
import { UserModule } from '../../user/user.module';

@Module({
    imports: [CommandModule, PermissionModule, RoleModule, UserModule],
    providers: [PermissionSeed, RoleSeed, UserSeed],
    exports: []
})
export class SeedsModule {}

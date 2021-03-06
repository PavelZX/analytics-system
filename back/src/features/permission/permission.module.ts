import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PermissionService } from '../permission/permission.service';
import {
    PermissionDatabaseName,
    PermissionEntity,
    PermissionSchema
} from './permission.schema';

@Module({
    providers: [PermissionService],
    exports: [PermissionService],
    imports: [
        MongooseModule.forFeature([
            {
                name: PermissionEntity.name,
                schema: PermissionSchema,
                collection: PermissionDatabaseName
            }
        ])
    ]
})
export class PermissionModule {}

import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Message } from '../../message/message.decorator';
import { MessageService } from '../../message/message.service';
import { ENUM_PERMISSIONS, PERMISSION_META_KEY } from '../permission.constant';

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        @Message() private readonly messageService: MessageService,
        private reflector: Reflector
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermission: ENUM_PERMISSIONS[] = this.reflector.getAllAndOverride<
            ENUM_PERMISSIONS[]
        >(PERMISSION_META_KEY, [context.getHandler(), context.getClass()]);
        if (!requiredPermission) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();
        const { role } = user;
        const { permissions } = role;

        const hasPermission: boolean = requiredPermission.every((permission) =>
            permissions.includes(permission)
        );

        if (!hasPermission) {
            throw new ForbiddenException(
                this.messageService.get('http.clientError.forbidden')
            );
        }
        return hasPermission;
    }
}

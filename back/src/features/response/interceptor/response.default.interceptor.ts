import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    mixin,
    Type
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Message } from '../../message/message.decorator';
import { MessageService } from '../../message/message.service';

// This interceptor for restructure response success
export function ResponseDefaultInterceptor(
    messagePath: string
): Type<NestInterceptor> {
    class MixinResponseDefaultInterceptor
        implements NestInterceptor<Promise<any>> {
        constructor(
            @Message() private readonly messageService: MessageService
        ) {}

        async intercept(
            context: ExecutionContext,
            next: CallHandler
        ): Promise<Observable<Promise<any> | string>> {
            const ctx: HttpArgumentsHost = context.switchToHttp();
            const responseExpress: any = ctx.getResponse();

            return next.handle().pipe(
                map(async (response: Promise<Record<string, any>>) => {
                    const statusCode: number = responseExpress.statusCode;
                    const data: Record<string, any> = await response;
                    const message: string =
                        this.messageService.get(messagePath) ||
                        this.messageService.get('response.default');

                    return {
                        statusCode,
                        message,
                        data
                    };
                })
            );
        }
    }

    return mixin(MixinResponseDefaultInterceptor);
}

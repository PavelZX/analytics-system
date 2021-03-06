import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Message } from '../message/message.decorator';
import { MessageService } from '../message/message.service';

// Restructure Response Object For Guard Exception
@Catch()
export class ResponseFilter implements ExceptionFilter {
    constructor(@Message() private readonly messageService: MessageService) {}

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx: HttpArgumentsHost = host.switchToHttp();
        const responseHttp: any = ctx.getResponse();

        if (exception instanceof HttpException) {
            const statusHttp: number = exception.getStatus();
            const response: any = exception.getResponse();
            const { error, message } = response;

            if (!Array.isArray(message) && typeof message !== 'string') {
                const statusHttp: number = HttpStatus.INTERNAL_SERVER_ERROR;
                const message: string = this.messageService.get(
                    'response.error.errorsMustInArray'
                );

                responseHttp.status(statusHttp).json({
                    statusCode: statusHttp,
                    message
                });
            } else if (Array.isArray(message)) {
                responseHttp.status(statusHttp).json({
                    statusCode: statusHttp,
                    message: error,
                    errors: message
                });
            } else {
                responseHttp.status(statusHttp).json({
                    statusCode: statusHttp,
                    message
                });
            }
        } else {
            // if error is not http cause
            const statusHttp: number = HttpStatus.INTERNAL_SERVER_ERROR;
            const message: string = this.messageService.get(
                'http.serverError.internalServerError'
            );

            responseHttp.status(statusHttp).json({
                statusCode: statusHttp,
                message: message
            });
        }
    }
}

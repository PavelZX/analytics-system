import {
    HttpDebuggerMiddleware,
    HttpDebuggerResponseMiddleware
} from '../middleware/http-debugger/http-debugger.middleware';
import { HelmetMiddleware } from '../middleware/helmet/helmet.middleware';
import { RateLimitMiddleware } from '../middleware/rate-limit/rate-limit.middleware';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';

@Module({})
export class MiddlewareModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        //! middleware
        consumer
            .apply(
                HttpDebuggerResponseMiddleware,
                HttpDebuggerMiddleware,
                HelmetMiddleware,
                RateLimitMiddleware
            )
            .forRoutes('*');
    }
}

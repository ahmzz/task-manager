import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayload } from '../dtos/token-payload';

export const UserDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserPayload => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = ctx.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return request.user;
  },
);

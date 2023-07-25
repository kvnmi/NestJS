import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from '@prisma/client';

export const GetUser = createParamDecorator(
  (data: keyof User, ctx: ExecutionContext) => {
    const req: Express.Request = ctx.switchToHttp().getRequest();

    const user = req.user;
    if (data) {
      return user[data];
    }
    return req.user;
  },
);

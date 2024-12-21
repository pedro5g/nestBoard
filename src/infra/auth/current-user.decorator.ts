import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TokenPayload } from './jwt.strategy';

export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext): TokenPayload => {
    return context.switchToHttp().getRequest<{ user: TokenPayload }>().user;
  },
);

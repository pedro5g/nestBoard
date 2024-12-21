import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { z } from 'zod';
import { AuthenticateUseCase } from '@/domain/forum/app/use-cases/authenticate';
import { Public } from '@/infra/auth/public';

const sessionBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type SessionBodySchema = z.infer<typeof sessionBodySchema>;

@Controller('account')
export class AuthenticationController {
  constructor(private readonly authenticateUseCase: AuthenticateUseCase) {}

  @Post('session')
  @UsePipes(new ZodValidationPipe(sessionBodySchema))
  @Public()
  async handle(@Body() body: SessionBodySchema) {
    const { email, password } = body;

    const result = await this.authenticateUseCase.execute({ email, password });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor.name) {
        case 'InvalidCredentialsError':
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    return {
      access_token: result.value.accessToken,
    };
  }
}

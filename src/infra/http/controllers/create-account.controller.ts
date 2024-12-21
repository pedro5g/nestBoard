import {
  HttpCode,
  UsePipes,
  ConflictException,
  Controller,
  Post,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { z } from 'zod';
import { RegisterStudentUseCase } from '@/domain/forum/app/use-cases/register-student';
import { Public } from '@/infra/auth/public';

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6).max(30),
});

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@Controller('account')
export class CreateAccountController {
  constructor(
    private readonly registerStudentUseCase: RegisterStudentUseCase,
  ) {}

  @Post('register')
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  @Public()
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = body;

    const result = await this.registerStudentUseCase.execute({
      name,
      email,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor.name) {
        case 'StudentAlreadyExistsError':
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}

import {
  HttpCode,
  UsePipes,
  ConflictException,
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe';
import { PrismaService } from '@/prisma/prisma.service';
import { z } from 'zod';
import { CryptService } from '@/cryptography/crypt.service';

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6).max(30),
});

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@Controller('account')
export class CreateAccountController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly crypt: CryptService,
  ) {}

  @Post('register')
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = body;

    const emailAlreadyRegistered = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (emailAlreadyRegistered) {
      throw new ConflictException(
        'This email already registered with another user',
      );
    }

    const passwordHash = await this.crypt.hash(password);

    await this.prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
      },
    });
  }
}

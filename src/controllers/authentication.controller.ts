import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe';
import { PrismaService } from '@/prisma/prisma.service';
import { z } from 'zod';
import { CryptService } from '@/cryptography/crypt.service';

const sessionBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type SessionBodySchema = z.infer<typeof sessionBodySchema>;

@Controller('account')
export class AuthenticationController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwt: JwtService,
    private readonly crypt: CryptService,
  ) {}

  @Post('session')
  @UsePipes(new ZodValidationPipe(sessionBodySchema))
  async handle(@Body() body: SessionBodySchema) {
    const { email, password } = body;

    const user = await this.prismaService.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!(await this.crypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwt.sign({ sub: user.id });

    return {
      access_token: token,
    };
  }
}

import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtStrategy } from '@/auth/jwt.strategy';
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe';
import { PrismaService } from '@/prisma/prisma.service';
import { z } from 'zod';

const paginationSchema = z.coerce.number().default(1);

@Controller('question')
@UseGuards(JwtStrategy)
export class GetRecentQuestionsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('get-recent')
  async handle(
    @Query('page', new ZodValidationPipe(paginationSchema)) page: number,
  ) {
    const PER_PAGE = 20;
    const questions = await this.prisma.question.findMany({
      take: PER_PAGE,
      skip: (page - 1) * PER_PAGE,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      questions,
    };
  }
}

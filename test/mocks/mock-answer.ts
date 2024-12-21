import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/database.service';
import { makeAnswer } from 'test/factories/make-answer';
import { PrismaAnswerMapper } from '@/infra/database/prisma/mappers/prisma-answer-mapper';
import { AnswerProps } from '@/domain/forum/enterprise/entities/answer';

@Injectable()
export class MockAnswer {
  constructor(private prisma: PrismaService) {}

  async insertAnswerOnDb(__data: Partial<AnswerProps>) {
    const answer = makeAnswer(__data);
    const data = PrismaAnswerMapper.toPrismaFormat(answer);
    await this.prisma.answer.create({ data });

    return answer;
  }
}

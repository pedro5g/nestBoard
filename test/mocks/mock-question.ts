import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/database.service';
import { makeQuestion } from 'test/factories/make-question';
import { PrismaQuestionMapper } from '@/infra/database/prisma/mappers/prisma-question-mapper';
import { QuestionProps } from '@/domain/forum/enterprise/entities/question';

@Injectable()
export class MockQuestion {
  constructor(private prisma: PrismaService) {}

  async insertQuestionOnDb(__data: Partial<QuestionProps> = {}) {
    const question = makeQuestion(__data);
    const data = PrismaQuestionMapper.toPrismaFormat(question);
    await this.prisma.question.create({ data });

    return question;
  }
}

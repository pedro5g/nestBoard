import { PaginationParams } from '@/core/domain/repository/pagination-params';
import { AnswersRepository } from '@/domain/forum/app/repositories/answer-repository';
import { Answer } from '@/domain/forum/enterprise/entities/answer';
import { Injectable } from '@nestjs/common';
import { PrismaAnswerMapper } from '../mappers/prisma-answer-mapper';
import { PrismaService } from '../database.service';
import { AnswerAttachmentsRepository } from '@/domain/forum/app/repositories/answer-attachment-repository';
import { AnswerWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/answer-with-author';
import { DomainEvents } from '@/core/events/domain-events';

@Injectable()
export class PrismaAnswerRepository implements AnswersRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly answerAttachmentRepository: AnswerAttachmentsRepository,
  ) {}
  async create(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrismaFormat(answer);
    await this.prisma.answer.create({
      data,
    });

    await this.answerAttachmentRepository.createMany(
      answer.attachment.getItems(),
    );

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }
  async delete(answer: Answer): Promise<void> {
    await this.prisma.answer.delete({
      where: {
        id: answer.id.toString(),
      },
    });
  }
  async update(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrismaFormat(answer);
    await Promise.all([
      this.prisma.answer.update({
        where: { id: data.id },
        data,
      }),
      this.answerAttachmentRepository.createMany(
        answer.attachment.getNewItems(),
      ),
      this.answerAttachmentRepository.deleteMany(
        answer.attachment.getRemovedItems(),
      ),
    ]);

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }
  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<Answer[]> {
    const answers = await this.prisma.answer.findMany({
      where: { questionId },
      take: 20,
      skip: (page - 1) * 20,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return answers.map(PrismaAnswerMapper.toDomainFormat);
  }

  async findManyAnswerWithAuthorByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<AnswerWithAuthor[]> {
    const answers = await this.prisma.answer.findMany({
      where: { questionId },
      select: {
        id: true,
        content: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
      take: 20,
      skip: (page - 1) * 20,
      orderBy: {
        createdAt: 'desc',
      },
    });
    return answers.map(PrismaAnswerMapper.toAnswerWithAuthorFormat);
  }
  async findById(answerId: string): Promise<Answer | null> {
    const answer = await this.prisma.answer.findUnique({
      where: { id: answerId },
    });

    if (!answer) return null;

    return PrismaAnswerMapper.toDomainFormat(answer);
  }
}

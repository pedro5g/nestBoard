import { PaginationParams } from '@/core/domain/repository/pagination-params';
import { QuestionsRepository } from '@/domain/forum/app/repositories/questions-repository';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database.service';
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper';
import { QuestionAttachmentsRepository } from '@/domain/forum/app/repositories/question-attachments-repository';
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details';
import { DomainEvents } from '@/core/events/domain-events';
import { CacheRepository } from '@/infra/cache/repository/cache-repository';

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(
    private readonly questionAttachmentRepository: QuestionAttachmentsRepository,
    private readonly cacheRepository: CacheRepository,
    private readonly prisma: PrismaService,
  ) {}
  async create(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrismaFormat(question);

    await this.prisma.question.create({ data });
    await this.questionAttachmentRepository.createMany(
      question.attachments.getItems(),
    );

    DomainEvents.dispatchEventsForAggregate(question.id);
  }
  async delete(question: Question): Promise<void> {
    await this.prisma.question.delete({
      where: {
        id: question.id.toString(),
      },
    });
  }

  async update(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrismaFormat(question);

    await Promise.all([
      this.prisma.question.update({
        where: {
          id: data.id,
        },
        data,
      }),
      this.questionAttachmentRepository.createMany(
        question.attachments.getNewItems(),
      ),
      this.questionAttachmentRepository.deleteMany(
        question.attachments.getRemovedItems(),
      ),
      this.cacheRepository.delete(`question:details:${question.slug.value}`),
    ]);

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async findById(questionId: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
    });
    if (!question) return null;

    return PrismaQuestionMapper.toDomainFormat(question);
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        slug,
      },
    });

    if (!question) return null;

    return PrismaQuestionMapper.toDomainFormat(question);
  }

  async getManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const questions = await this.prisma.question.findMany({
      take: 20,
      skip: (page - 1) * 20,
      orderBy: {
        createdAt: 'desc',
      },
    });
    return questions.map(PrismaQuestionMapper.toDomainFormat);
  }

  async findQuestionWithDetailsBySlug(
    slug: string,
  ): Promise<QuestionDetails | null> {
    const cacheHit = await this.cacheRepository.get(`question:details:${slug}`);

    if (cacheHit) {
      return PrismaQuestionMapper.toQuestionDetailsFormat(JSON.parse(cacheHit));
    }

    const question = await this.prisma.question.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        content: true,
        slug: true,
        bestAnswerId: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        attachments: {
          select: {
            title: true,
            url: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!question) return null;

    await this.cacheRepository.set(
      `question:details:${slug}`,
      JSON.stringify(question),
    );

    const questionDetails =
      PrismaQuestionMapper.toQuestionDetailsFormat(question);

    return questionDetails;
  }
}

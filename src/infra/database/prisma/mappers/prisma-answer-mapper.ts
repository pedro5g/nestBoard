import { UniqueEntityId } from '@/core/domain/value-objects/unique-entity-id';
import { Answer } from '@/domain/forum/enterprise/entities/answer';
import { AnswerWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/answer-with-author';
import { Answer as PrismaAnswer, Prisma } from '@prisma/client';

type PrismaAnswerWithAuthor = {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date | null;
  author: {
    id: string;
    name: string;
  };
};
export class PrismaAnswerMapper {
  static toDomainFormat(raw: PrismaAnswer): Answer {
    return Answer.create(
      {
        content: raw.content,
        authorId: new UniqueEntityId(raw.authorId),
        questionId: new UniqueEntityId(raw.questionId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrismaFormat(raw: Answer): Prisma.AnswerUncheckedCreateInput {
    return {
      id: raw.id.toString(),
      content: raw.content,
      authorId: raw.authorId,
      questionId: raw.questionId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }

  static toAnswerWithAuthorFormat(
    raw: PrismaAnswerWithAuthor,
  ): AnswerWithAuthor {
    return AnswerWithAuthor.create({
      answerId: new UniqueEntityId(raw.id),
      content: raw.content,
      author: {
        authorId: new UniqueEntityId(raw.author.id),
        authorName: raw.author.name,
      },
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}

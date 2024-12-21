import { UniqueEntityId } from '@/core/domain/value-objects/unique-entity-id';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comments';
import { Comment as PrismaComment, Prisma } from '@prisma/client';

export class PrismaAnswerCommentMapper {
  static toDomainFormat(raw: PrismaComment): AnswerComment {
    if (!raw.answerId) throw new Error('something very wrong happened');
    return AnswerComment.create(
      {
        content: raw.content,
        authorId: new UniqueEntityId(raw.authorId),
        answerId: new UniqueEntityId(raw.answerId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrismaFormat(
    raw: AnswerComment,
  ): Prisma.CommentUncheckedCreateInput {
    return {
      id: raw.id.toString(),
      content: raw.content,
      authorId: raw.authorId,
      answerId: raw.answerId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }
}

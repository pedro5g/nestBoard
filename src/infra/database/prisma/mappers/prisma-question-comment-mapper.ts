import { UniqueEntityId } from '@/core/domain/value-objects/unique-entity-id';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comments';
import { Prisma, Comment as PrismaComment } from '@prisma/client';

export class PrismaQuestionCommentMapper {
  static toDomainFormat(raw: PrismaComment): QuestionComment {
    if (!raw.questionId) throw new Error('something very wrong happened');
    return QuestionComment.create(
      {
        authorId: new UniqueEntityId(raw.authorId),
        content: raw.content,
        questionId: new UniqueEntityId(raw.questionId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrismaFormat(
    raw: QuestionComment,
  ): Prisma.CommentUncheckedCreateInput {
    return {
      id: raw.id.toString(),
      content: raw.content,
      authorId: raw.authorId,
      questionId: raw.questionId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }
}

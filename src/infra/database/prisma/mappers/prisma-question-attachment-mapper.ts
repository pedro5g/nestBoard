import { UniqueEntityId } from '@/core/domain/value-objects/unique-entity-id';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';
import { Prisma, Attachment as PrismaAttachment } from '@prisma/client';

export class PrismaQuestionAttachmentMapper {
  static toDomainFormat(raw: PrismaAttachment): QuestionAttachment {
    if (!raw.questionId) throw new Error('Something too wrong happened');
    return QuestionAttachment.create(
      {
        questionId: new UniqueEntityId(raw.questionId),
        attachmentId: new UniqueEntityId(raw.id),
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrismaUpdateMany(
    attachments: QuestionAttachment[],
  ): Prisma.AttachmentUpdateManyArgs {
    const ids = attachments.map((att) => att.attachmentId.toString());

    return {
      where: { id: { in: ids } },
      data: {
        questionId: attachments[0].questionId.toString(),
      },
    };
  }
}

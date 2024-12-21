import { UniqueEntityId } from '@/core/domain/value-objects/unique-entity-id';
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';
import { Prisma, Attachment as PrismaAttachment } from '@prisma/client';

export class PrismaAnswerAttachmentMapper {
  static toDomainFormat(raw: PrismaAttachment): AnswerAttachment {
    if (!raw.answerId) throw new Error('Something too wrong happened');
    return AnswerAttachment.create(
      {
        answerId: new UniqueEntityId(raw.answerId),
        attachmentId: new UniqueEntityId(raw.id),
      },
      new UniqueEntityId(raw.id),
    );
  }
  static toPrismaUpdateMany(
    attachments: AnswerAttachment[],
  ): Prisma.AttachmentUpdateManyArgs {
    const ids = attachments.map((att) => att.attachmentId.toString());
    return {
      where: { id: { in: ids } },
      data: { answerId: attachments[0].answerId.toString() },
    };
  }
}

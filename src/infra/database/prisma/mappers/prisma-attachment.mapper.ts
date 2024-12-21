import { UniqueEntityId } from '@/core/domain/value-objects/unique-entity-id';
import { Attachment } from '@/domain/forum/enterprise/entities/attachment';
import { Prisma, Attachment as PrismaAttachment } from '@prisma/client';

export class PrismaAttachmentMapper {
  static toDomainFormat(raw: PrismaAttachment): Attachment {
    if (!raw.questionId) throw new Error('Something too wrong happened');
    return Attachment.create(
      {
        title: raw.title,
        link: raw.url,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrismaFormat(raw: Attachment): Prisma.AttachmentCreateInput {
    return {
      id: raw.id.toString(),
      title: raw.title,
      url: raw.link,
    };
  }
}

import { AnswerAttachmentsRepository } from '@/domain/forum/app/repositories/answer-attachment-repository';
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';
import { Injectable } from '@nestjs/common';
import { PrismaAnswerAttachmentMapper } from '../mappers/prisma-answer-attachment-mapper';
import { PrismaService } from '../database.service';

@Injectable()
export class PrismaAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  constructor(private prisma: PrismaService) {}

  create(AnswerAttachment: AnswerAttachment): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const attachments = await this.prisma.attachment.findMany({
      where: {
        answerId,
      },
    });

    return attachments.map(PrismaAnswerAttachmentMapper.toDomainFormat);
  }
  async deleteManyByAnswerId(answerId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({ where: { answerId } });
  }

  async createMany(attachments: AnswerAttachment[]): Promise<void> {
    if (attachments.length === 0) return;
    const data = PrismaAnswerAttachmentMapper.toPrismaUpdateMany(attachments);
    await this.prisma.attachment.updateMany(data);
  }

  async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
    if (attachments.length === 0) return;
    const ids = attachments.map((att) => att.attachmentId.toString());
    await this.prisma.attachment.deleteMany({ where: { id: { in: ids } } });
  }
}

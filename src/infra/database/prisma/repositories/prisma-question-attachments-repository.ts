import { QuestionAttachmentsRepository } from '@/domain/forum/app/repositories/question-attachments-repository';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';
import { Injectable } from '@nestjs/common';
import { PrismaQuestionAttachmentMapper } from '../mappers/prisma-question-attachment-mapper';
import { PrismaService } from '../database.service';

@Injectable()
export class PrismaQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(questionAttachment: QuestionAttachment): Promise<void> {
    await this.prisma.attachment.create({
      data: {
        id: questionAttachment.attachmentId.toString(),
        questionId: questionAttachment.questionId.toString(),
        title: '',
        url: '',
      },
    });
  }

  async createMany(attachments: QuestionAttachment[]): Promise<void> {
    if (attachments.length === 0) return;

    const data = PrismaQuestionAttachmentMapper.toPrismaUpdateMany(attachments);

    await this.prisma.attachment.updateMany(data);
  }

  async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
    if (attachments.length === 0) return;
    const ids = attachments.map((att) => att.attachmentId.toString());
    await this.prisma.attachment.deleteMany({ where: { id: { in: ids } } });
  }

  async findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]> {
    const attachments = await this.prisma.attachment.findMany({
      where: {
        questionId,
      },
    });

    return attachments.map(PrismaQuestionAttachmentMapper.toDomainFormat);
  }
  async deleteManyByQuestionId(questionId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({ where: { questionId } });
  }
}

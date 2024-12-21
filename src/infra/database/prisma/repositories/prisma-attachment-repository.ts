import { AttachmentRepository } from '@/domain/forum/app/repositories/attachment-repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database.service';
import { Attachment } from '@/domain/forum/enterprise/entities/attachment';
import { PrismaAttachmentMapper } from '../mappers/prisma-attachment.mapper';

@Injectable()
export class PrismaAttachmentRepository implements AttachmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(attachment: Attachment): Promise<void> {
    const data = PrismaAttachmentMapper.toPrismaFormat(attachment);
    await this.prisma.attachment.create({
      data,
    });
  }
}

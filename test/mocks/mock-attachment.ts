import { AttachmentProps } from '@/domain/forum/enterprise/entities/attachment';
import { PrismaService } from '@/infra/database/prisma/database.service';
import { PrismaAttachmentMapper } from '@/infra/database/prisma/mappers/prisma-attachment.mapper';
import { Injectable } from '@nestjs/common';
import { makeAttachment } from 'test/factories/make-attachment';

@Injectable()
export class MockAttachment {
  constructor(private prisma: PrismaService) {}

  async insertAttachmentOnDb(__data: Partial<AttachmentProps> = {}) {
    const attachment = makeAttachment(__data);

    await this.prisma.attachment.create({
      data: PrismaAttachmentMapper.toPrismaFormat(attachment),
    });

    return attachment;
  }
}

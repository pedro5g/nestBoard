import { UniqueEntityId } from '@/core/domain/value-objects/unique-entity-id';
import { QuestionProps } from '@/domain/forum/enterprise/entities/question';
import { PrismaService } from '@/infra/database/prisma/database.service';
import { Injectable } from '@nestjs/common';
import { makeQuestion } from 'test/factories/make-question';
import { makeQuestionAttachment } from 'test/factories/make-question-attachment';

@Injectable()
export class MockQuestionAttachment {
  constructor(private prisma: PrismaService) {}

  async insertAttachmentOnDb(
    __data: Partial<QuestionProps & { id: UniqueEntityId }> = {},
  ) {
    const { id, ...rest } = __data;
    const question = makeQuestion(rest, id);
    const attachment = makeQuestionAttachment({ questionId: question.id });

    await this.prisma.attachment.create({
      data: {
        id: attachment.attachmentId.toString(),
        questionId: attachment.questionId.toString(),
        title: '',
        url: '',
      },
    });

    return { attachment, question };
  }
}

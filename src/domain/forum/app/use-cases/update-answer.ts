import { Either, left, right } from '@/core/__error/either';
import { AnswersRepository } from '../repositories/answer-repository';
import { ResourceNotFoundError } from '../../../../core/__error/__errors/resource-not-found-error';
import { NotAllowedError } from '../../../../core/__error/__errors/not-allowed-error';
import { AnswerAttachmentsRepository } from '../repositories/answer-attachment-repository';
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list';
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment';
import { UniqueEntityId } from '@/core/domain/value-objects/unique-entity-id';
import { Injectable } from '@nestjs/common';

export interface UpdateAnswerUseCaseRequest {
  content: string;
  attachmentsIds: string[];
  answerId: string;
  authorId: string;
}

export type UpdateAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>;
@Injectable()
export class UpdateAnswerUseCase {
  constructor(
    private readonly answersRepository: AnswersRepository,
    private readonly answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}
  async execute({
    content,
    attachmentsIds,
    answerId,
    authorId,
  }: UpdateAnswerUseCaseRequest): Promise<UpdateAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== answer.authorId) {
      return left(new NotAllowedError());
    }

    const currentAttachment =
      await this.answerAttachmentsRepository.findManyByAnswerId(answerId);
    const answerAttachmentsList = new AnswerAttachmentList(currentAttachment);

    const answerAttachments = attachmentsIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        answerId: answer.id,
      });
    });

    answerAttachmentsList.update(answerAttachments);
    answer.setAttachment(answerAttachmentsList);
    answer.updateContent(content);

    await this.answersRepository.update(answer);

    return right({});
  }
}

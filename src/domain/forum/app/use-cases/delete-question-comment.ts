import { Either, left, right } from '@/core/__error/either';
import { QuestionCommentsRepository } from '../repositories/question-comments-repository';
import { ResourceNotFoundError } from '../../../../core/__error/__errors/resource-not-found-error';
import { NotAllowedError } from '../../../../core/__error/__errors/not-allowed-error';
import { Injectable } from '@nestjs/common';

export interface DeleteQuestionCommentUseCaseRequest {
  commentId: string;
  authorId: string;
}

export type DeleteQuestionCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>;
@Injectable()
export class DeleteQuestionCommentUseCase {
  constructor(
    private readonly answerCommentsRepository: QuestionCommentsRepository,
  ) {}
  async execute({
    commentId,
    authorId,
  }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
    const answerComment =
      await this.answerCommentsRepository.findById(commentId);

    if (!answerComment) {
      return left(new ResourceNotFoundError('Question comment not found '));
    }

    if (authorId !== answerComment.authorId) {
      return left(new NotAllowedError('Not allowed'));
    }

    await this.answerCommentsRepository.delete(answerComment);

    return right({});
  }
}

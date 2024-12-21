import { Either, left, right } from '@/core/__error/either';
import { QuestionsRepository } from '../repositories/questions-repository';
import { NotAllowedError } from '../../../../core/__error/__errors/not-allowed-error';
import { ResourceNotFoundError } from '../../../../core/__error/__errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';

export interface DeleteQuestionUseCaseRequest {
  questionId: string;
  authorId: string;
}

export type DeleteQuestionUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {}
>;

@Injectable()
export class DeleteQuestionUseCase {
  constructor(private readonly questionsRepository: QuestionsRepository) {}
  async execute({
    questionId,
    authorId,
  }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== question.authorId) {
      return left(new NotAllowedError());
    }

    await this.questionsRepository.delete(question);

    return right({});
  }
}

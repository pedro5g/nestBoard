import { Either, left, right } from '@/core/__error/either';
import { AnswersRepository } from '../repositories/answer-repository';
import { ResourceNotFoundError } from '../../../../core/__error/__errors/resource-not-found-error';
import { NotAllowedError } from '../../../../core/__error/__errors/not-allowed-error';
import { Injectable } from '@nestjs/common';

export interface DeleteAnswerUseCaseRequest {
  answerId: string;
  authorId: string;
}

export type DeleteAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>;
@Injectable()
export class DeleteAnswerUseCase {
  constructor(private readonly answersRepository: AnswersRepository) {}
  async execute({
    answerId,
    authorId,
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== answer.authorId) {
      return left(new NotAllowedError());
    }

    await this.answersRepository.delete(answer);

    return right({});
  }
}

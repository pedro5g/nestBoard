import { Either, right } from '@/core/__error/either';
import { Answer } from '../../enterprise/entities/answer';
import { AnswersRepository } from '../repositories/answer-repository';
import { Injectable } from '@nestjs/common';
import { AnswerWithAuthor } from '../../enterprise/entities/value-objects/answer-with-author';

export interface FetchQuestionAnswersRequest {
  page: number;
  questionId: string;
}

export type FetchQuestionAnswersResponse = Either<
  null,
  {
    answers: AnswerWithAuthor[];
  }
>;

@Injectable()
export class FetchQuestionAnswersUseCase {
  constructor(private readonly answersRepository: AnswersRepository) {}
  async execute({
    page,
    questionId,
  }: FetchQuestionAnswersRequest): Promise<FetchQuestionAnswersResponse> {
    const answers =
      await this.answersRepository.findManyAnswerWithAuthorByQuestionId(
        questionId,
        {
          page,
        },
      );
    return right({ answers });
  }
}

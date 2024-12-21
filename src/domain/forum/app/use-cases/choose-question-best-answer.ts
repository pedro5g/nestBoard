import { QuestionsRepository } from '../repositories/questions-repository';
import { Answer } from '../../enterprise/entities/answer';
import { AnswersRepository } from '../repositories/answer-repository';
import { Either, left, right } from '@/core/__error/either';
import { ResourceNotFoundError } from '../../../../core/__error/__errors/resource-not-found-error';
import { NotAllowedError } from '../../../../core/__error/__errors/not-allowed-error';
import { Injectable } from '@nestjs/common';

export interface ChooseQuestionBestAnswerUseCaseRequest {
  answerId: string;
  authorId: string;
}

export type ChooseQuestionBestAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    answer: Answer;
  }
>;

@Injectable()
export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private readonly answersRepository: AnswersRepository,
    private readonly questionsRepository: QuestionsRepository,
  ) {}
  async execute({
    answerId,
    authorId,
  }: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    const question = await this.questionsRepository.findById(answer.questionId);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    if (question.authorId !== authorId) {
      return left(new NotAllowedError());
    }

    question.setBeastAnswerId(answer.id);
    await this.questionsRepository.update(question);

    return right({
      answer,
    });
  }
}

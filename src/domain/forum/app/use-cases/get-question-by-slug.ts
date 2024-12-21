import { Either, left, right } from '@/core/__error/either';
import { QuestionsRepository } from '../repositories/questions-repository';
import { ResourceNotFoundError } from '../../../../core/__error/__errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { QuestionDetails } from '../../enterprise/entities/value-objects/question-details';

export interface GetQuestionBySlugUseCaseRequest {
  slug: string;
}

export type GetQuestionBySlugUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    question: QuestionDetails;
  }
>;
@Injectable()
export class GetQuestionBySlugUseCase {
  constructor(private readonly questionsRepository: QuestionsRepository) {}
  async execute({
    slug,
  }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
    const question =
      await this.questionsRepository.findQuestionWithDetailsBySlug(slug);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    return right({ question });
  }
}

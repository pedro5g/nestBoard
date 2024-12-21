import { Either, right } from '@/core/__error/either';
import { Question } from '../../enterprise/entities/question';
import { QuestionsRepository } from '../repositories/questions-repository';
import { Injectable } from '@nestjs/common';

export interface FetchRecentQuestionsRequest {
  page: number;
}

export type FetchRecentQuestionsResponse = Either<
  null,
  {
    questions: Question[];
  }
>;
@Injectable()
export class FetchRecentQuestionsUseCase {
  constructor(private readonly questionsRepository: QuestionsRepository) {}
  async execute({
    page,
  }: FetchRecentQuestionsRequest): Promise<FetchRecentQuestionsResponse> {
    const questions = await this.questionsRepository.getManyRecent({ page });
    return right({ questions });
  }
}

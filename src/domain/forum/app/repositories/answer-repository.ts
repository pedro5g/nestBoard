import { PaginationParams } from '@/core/domain/repository/pagination-params';
import { Answer } from '../../enterprise/entities/answer';
import { AnswerWithAuthor } from '../../enterprise/entities/value-objects/answer-with-author';

export abstract class AnswersRepository {
  abstract create(answer: Answer): Promise<void>;
  abstract delete(answer: Answer): Promise<void>;
  abstract update(answer: Answer): Promise<void>;
  abstract findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<Answer[]>;
  abstract findManyAnswerWithAuthorByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<AnswerWithAuthor[]>;
  abstract findById(answerId: string): Promise<Answer | null>;
}

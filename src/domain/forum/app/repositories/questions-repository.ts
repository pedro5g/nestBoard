import { PaginationParams } from '@/core/domain/repository/pagination-params';
import { Question } from '../../enterprise/entities/question';
import { QuestionDetails } from '../../enterprise/entities/value-objects/question-details';

export abstract class QuestionsRepository {
  abstract create(question: Question): Promise<void>;
  abstract delete(question: Question): Promise<void>;
  abstract update(question: Question): Promise<void>;
  abstract findById(questionId: string): Promise<Question | null>;
  abstract findBySlug(slug: string): Promise<Question | null>;
  abstract findQuestionWithDetailsBySlug(
    slug: string,
  ): Promise<QuestionDetails | null>;
  abstract getManyRecent({ page }: PaginationParams): Promise<Question[]>;
}

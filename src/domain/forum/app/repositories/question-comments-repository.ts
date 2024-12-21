import { PaginationParams } from '@/core/domain/repository/pagination-params';
import { QuestionComment } from '../../enterprise/entities/question-comments';
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author';

export abstract class QuestionCommentsRepository {
  abstract create(comment: QuestionComment): Promise<void>;
  abstract update(comment: QuestionComment): Promise<void>;
  abstract delete(comment: QuestionComment): Promise<void>;
  abstract findById(commentId: string): Promise<QuestionComment | null>;
  abstract findManyByQuestionId(
    questionId: string,
    props: PaginationParams,
  ): Promise<QuestionComment[]>;
  abstract findManyByQuestionIdWithAuthor(
    questionId: string,
    props: PaginationParams,
  ): Promise<CommentWithAuthor[]>;
}

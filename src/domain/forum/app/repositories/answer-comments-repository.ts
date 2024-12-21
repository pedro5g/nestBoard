import { PaginationParams } from '@/core/domain/repository/pagination-params';
import { AnswerComment } from '../../enterprise/entities/answer-comments';
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author';

export abstract class AnswerCommentsRepository {
  abstract create(comment: AnswerComment): Promise<void>;
  abstract update(comment: AnswerComment): Promise<void>;
  abstract delete(comment: AnswerComment): Promise<void>;
  abstract findById(commentId: string): Promise<AnswerComment | null>;
  abstract findManyByAnswerId(
    answerId: string,
    props: PaginationParams,
  ): Promise<AnswerComment[]>;
  abstract findManyByAnswerIdWithAuthor(
    answerId: string,
    props: PaginationParams,
  ): Promise<CommentWithAuthor[]>;
}

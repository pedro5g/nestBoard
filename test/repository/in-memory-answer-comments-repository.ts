import { PaginationParams } from '@/core/domain/repository/pagination-params';
import { DomainEvents } from '@/core/events/domain-events';
import { AnswerCommentsRepository } from '@/domain/forum/app/repositories/answer-comments-repository';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comments';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';
import { InMemoryStudentRepository } from './in-memory-student-repository';

export class InMemoryAnswersCommentsRepository
  implements AnswerCommentsRepository
{
  private _items: AnswerComment[] = [];

  constructor(private readonly studentRepository: InMemoryStudentRepository) {}

  async create(comment: AnswerComment): Promise<void> {
    this._items.push(comment);
    DomainEvents.dispatchEventsForAggregate(comment.id);
  }

  async delete(comment: AnswerComment): Promise<void> {
    this._items = this._items.filter((i) => i.id !== comment.id);
  }

  async update(comment: AnswerComment): Promise<void> {
    const commentInx = this._items.findIndex((i) => i.id === comment.id);

    this._items.splice(commentInx, 1, comment);
  }

  async findById(commentId: string): Promise<AnswerComment | null> {
    const comment = this._items.find((i) => i.id.toString() === commentId);

    return comment ?? null;
  }
  async findManyByAnswerId(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<AnswerComment[]> {
    const LIMIT: number = 20;

    const START: number = (page - 1) * LIMIT;
    const END: number = page * LIMIT;

    return this._items.filter((i) => i.answerId === answerId).slice(START, END);
  }
  async findManyByAnswerIdWithAuthor(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<CommentWithAuthor[]> {
    const LIMIT: number = 20;

    const START: number = (page - 1) * LIMIT;
    const END: number = page * LIMIT;

    return this._items
      .filter((i) => i.answerId === answerId)
      .slice(START, END)
      .map((comment) => {
        const author = this.studentRepository.items.find((student) => {
          return student.id.toString() === comment.authorId;
        });

        if (!author) throw new Error('Author does not exist');

        return CommentWithAuthor.create({
          commentId: comment.id,
          content: comment.content,
          author: {
            authorId: author.id,
            authorName: author.name,
          },
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
        });
      });
  }

  get items(): AnswerComment[] {
    return this._items;
  }
}

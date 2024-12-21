import { PaginationParams } from '@/core/domain/repository/pagination-params';
import { DomainEvents } from '@/core/events/domain-events';
import { QuestionCommentsRepository } from '@/domain/forum/app/repositories/question-comments-repository';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comments';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';
import { InMemoryStudentRepository } from './in-memory-student-repository';
import { InMemoryQuestionsRepository } from './in-memory-questions-repository';

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  constructor(private readonly studentRepository: InMemoryStudentRepository) {}
  private _items: QuestionComment[] = [];

  async create(comment: QuestionComment): Promise<void> {
    this._items.push(comment);
    DomainEvents.dispatchEventsForAggregate(comment.id);
  }

  async delete(comment: QuestionComment): Promise<void> {
    this._items = this._items.filter((i) => i.id !== comment.id);
  }

  async update(comment: QuestionComment): Promise<void> {
    const commentInx = this._items.findIndex((i) => i.id === comment.id);

    this._items.splice(commentInx, 1, comment);
  }

  async findById(commentId: string): Promise<QuestionComment | null> {
    const comment = this._items.find((i) => i.id.toString() === commentId);

    return comment ?? null;
  }
  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<QuestionComment[]> {
    const LIMIT: number = 20;

    const START: number = (page - 1) * LIMIT;
    const END: number = page * LIMIT;

    return this._items
      .filter((i) => i.questionId === questionId)
      .slice(START, END);
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<CommentWithAuthor[]> {
    const LIMIT: number = 20;

    const START: number = (page - 1) * LIMIT;
    const END: number = page * LIMIT;

    return this._items
      .filter((i) => i.questionId === questionId)
      .slice(START, END)
      .map((i) => {
        const author = this.studentRepository.items.find(
          (student) => student.id.toString() === i.authorId,
        );

        if (!author) {
          throw new Error('Author does not exist.');
        }

        return CommentWithAuthor.create({
          commentId: i.id,
          content: i.content,
          author: {
            authorId: author.id,
            authorName: author.name,
          },
          createdAt: i.createdAt,
          updatedAt: i.updatedAt,
        });
      });
  }

  get items(): QuestionComment[] {
    return this._items;
  }
}

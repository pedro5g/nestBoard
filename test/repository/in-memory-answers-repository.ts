import { PaginationParams } from '@/core/domain/repository/pagination-params';
import { DomainEvents } from '@/core/events/domain-events';
import { AnswerAttachmentsRepository } from '@/domain/forum/app/repositories/answer-attachment-repository';
import { AnswersRepository } from '@/domain/forum/app/repositories/answer-repository';
import { Answer } from '@/domain/forum/enterprise/entities/answer';
import { AnswerWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/answer-with-author';
import { InMemoryStudentRepository } from './in-memory-student-repository';

export class InMemoryAnswersRepository implements AnswersRepository {
  private _items: Answer[] = [];

  constructor(
    private readonly answerAttachmentRepository: AnswerAttachmentsRepository,
    private readonly studentRepository: InMemoryStudentRepository,
  ) {}

  async create(answer: Answer): Promise<void> {
    this._items.push(answer);
    this.answerAttachmentRepository.createMany(answer.attachment.getItems());
    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async delete(answer: Answer): Promise<void> {
    const aswIndex = this._items.findIndex((i) => i.id === answer.id);

    this._items.splice(aswIndex, 1);

    await this.answerAttachmentRepository.deleteManyByAnswerId(
      answer.id.toString(),
    );
  }

  async update(answer: Answer): Promise<void> {
    const aswIndex = this._items.findIndex((i) => i.id === answer.id);

    this._items.splice(aswIndex, 1, answer);
    this.answerAttachmentRepository.createMany(answer.attachment.getNewItems());
    this.answerAttachmentRepository.deleteMany(
      answer.attachment.getRemovedItems(),
    );
    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<Answer[]> {
    const LIMIT: number = 20;

    const answers = this._items
      .filter((i) => i.questionId === questionId)
      .slice((page - 1) * LIMIT, page * LIMIT);

    return answers;
  }

  async findManyAnswerWithAuthorByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<AnswerWithAuthor[]> {
    const LIMIT: number = 20;

    const answers = this._items
      .filter((i) => i.questionId === questionId)
      .slice((page - 1) * LIMIT, page * LIMIT)
      .map((answer) => {
        const author = this.studentRepository.items.find(
          (i) => i.id.toString() === answer.authorId,
        );
        if (!author) throw new Error('Oh author not found');
        return AnswerWithAuthor.create({
          answerId: answer.id,
          content: answer.content,
          author: {
            authorId: author.id,
            authorName: author.name,
          },
          createdAt: answer.createdAt,
          updatedAt: answer.updatedAt,
        });
      });

    return answers;
  }

  async findById(answerId: string): Promise<Answer | null> {
    const _answer = this._items.find((i) => i.id.toString() === answerId);

    return _answer ?? null;
  }

  get items(): Answer[] {
    return this._items;
  }
}

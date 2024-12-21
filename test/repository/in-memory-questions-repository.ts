import { PaginationParams } from '@/core/domain/repository/pagination-params';
import { DomainEvents } from '@/core/events/domain-events';
import { QuestionAttachmentsRepository } from '@/domain/forum/app/repositories/question-attachments-repository';
import { QuestionsRepository } from '@/domain/forum/app/repositories/questions-repository';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details';
import { InMemoryQuestionAttachmentsRepository } from './in-memory-question-attachments-repository';
import { InMemoryAttachmentRepository } from './in-memory-attachment-repository';
import { InMemoryStudentRepository } from './in-memory-student-repository';

export class InMemoryQuestionsRepository implements QuestionsRepository {
  private _items: Question[] = [];

  constructor(
    private readonly questionAttachmentRepository: InMemoryQuestionAttachmentsRepository,
    private readonly attachmentsRepository: InMemoryAttachmentRepository,
    private readonly studentRepository: InMemoryStudentRepository,
  ) {}

  async create(question: Question): Promise<void> {
    this._items.push(question);
    await this.questionAttachmentRepository.createMany(
      question.attachments.getItems(),
    );
  }

  async update(question: Question): Promise<void> {
    const qstIndex = this._items.findIndex((i) => i.id === question.id);
    this._items.splice(qstIndex, 1, question);

    await this.questionAttachmentRepository.createMany(
      question.attachments.getNewItems(),
    );
    await this.questionAttachmentRepository.deleteMany(
      question.attachments.getRemovedItems(),
    );

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async delete(question: Question): Promise<void> {
    const qstIndex = this._items.findIndex((i) => i.id !== question.id);

    this._items.splice(qstIndex, 1);

    await this.questionAttachmentRepository.deleteManyByQuestionId(
      question.id.toString(),
    );
  }
  async getManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const LIMIT: number = 20;

    const questions = this._items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * LIMIT, page * LIMIT);

    return questions;
  }

  async findById(questionId: string): Promise<Question | null> {
    const _question = this._items.find((i) => i.id.toString() === questionId);

    return _question ?? null;
  }
  async findBySlug(slug: string): Promise<Question | null> {
    const question = this._items.find((i) => i.slug.value === slug);

    return question ?? null;
  }

  async findQuestionWithDetailsBySlug(
    slug: string,
  ): Promise<QuestionDetails | null> {
    const question = this._items.find((i) => i.slug.value === slug);
    if (!question) return null;
    const author = await this.studentRepository.findById(question.authorId);
    if (!author) return null;
    const questionAttachments =
      await this.questionAttachmentRepository.findManyByQuestionId(
        question.id.toString(),
      );
    const attachments = this.attachmentsRepository.items.filter((item) => {
      return questionAttachments.some((qa) => qa.attachmentId.equals(item.id));
    });

    return QuestionDetails.create({
      questionId: question.id,
      title: question.title,
      content: question.content,
      slug: question.slug,
      bestAnswerId: question.bestAnswerId,
      author: { authorId: author.id, authorName: author.name },
      attachments,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    });
  }

  get items(): Question[] {
    return this._items;
  }
}

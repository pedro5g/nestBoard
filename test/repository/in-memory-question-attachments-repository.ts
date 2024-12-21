import { QuestionAttachmentsRepository } from '@/domain/forum/app/repositories/question-attachments-repository';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';

export class InMemoryQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  private _items: QuestionAttachment[] = [];

  async create(questionAttachment: QuestionAttachment): Promise<void> {
    this._items.push(questionAttachment);
  }

  async createMany(attachments: QuestionAttachment[]): Promise<void> {
    this._items.push(...attachments);
  }

  async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
    this._items = this._items.filter((i) => {
      return !attachments.some((att) => att.equals(i));
    });
  }

  async findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]> {
    return this._items.filter((v) => {
      return v.questionId.toString() === questionId;
    });
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    this._items = this._items.filter(
      (v) => v.questionId.toString() !== questionId,
    );
  }

  public get items(): QuestionAttachment[] {
    return this._items;
  }
}

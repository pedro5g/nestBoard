import { AnswerAttachmentsRepository } from '@/domain/forum/app/repositories/answer-attachment-repository';
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';

export class InMemoryAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  private _items: AnswerAttachment[] = [];

  async create(answerAttachment: AnswerAttachment): Promise<void> {
    this._items.push(answerAttachment);
  }

  async createMany(attachments: AnswerAttachment[]): Promise<void> {
    this._items.push(...attachments);
  }

  async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
    this._items = this._items.filter((i) => {
      return !attachments.some(
        (att) => att.attachmentId.toString() === i.attachmentId.toString(),
      );
    });
  }

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    return this._items.filter((v) => {
      return v.answerId.toString() === answerId;
    });
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    this._items = this._items.filter((v) => v.answerId.toString() !== answerId);
  }

  public get items(): AnswerAttachment[] {
    return this._items;
  }
}

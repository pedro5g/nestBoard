import { AttachmentRepository } from '@/domain/forum/app/repositories/attachment-repository';
import { Attachment } from '@/domain/forum/enterprise/entities/attachment';

export class InMemoryAttachmentRepository implements AttachmentRepository {
  private _items: Attachment[] = [];

  async create(attachment: Attachment): Promise<void> {
    this._items.push(attachment);
  }

  get items(): Attachment[] {
    return this._items;
  }
}

import { NotificationsRepository } from '@/domain/notification/app/repositories/notification-repository';
import { Notification } from '@/domain/notification/enterprise/entities/notification';

export class InMemoryNotificationsRepository
  implements NotificationsRepository
{
  private _items: Notification[] = [];

  get items(): Notification[] {
    return this._items;
  }

  async create(notification: Notification): Promise<void> {
    this._items.push(notification);
  }

  async save(notification: Notification): Promise<void> {
    const notificationIdx = this._items.findIndex(
      (v) => v.id.toString() === notification.id.toString(),
    );

    this._items.splice(notificationIdx, 1, notification);
  }

  async findById(id: string): Promise<Notification | null> {
    return (
      this._items.find((v) => {
        return v.id.toString() === id;
      }) ?? null
    );
  }
}

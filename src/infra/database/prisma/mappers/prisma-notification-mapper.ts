import { UniqueEntityId } from '@/core/domain/value-objects/unique-entity-id';
import { Notification } from '@/domain/notification/enterprise/entities/notification';
import { Notification as PrismaNotification } from '@prisma/client';

export class PrismaNotificationMapper {
  static toDomainFormat(raw: PrismaNotification): Notification {
    return Notification.create(
      {
        title: raw.title,
        content: raw.content,
        recipientId: new UniqueEntityId(raw.recipientId),
        readAt: raw.readAt,
        createdAt: raw.createdAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrismaFormat(raw: Notification) {
    return {
      id: raw.id.toString(),
      title: raw.title,
      content: raw.content,
      readAt: raw.readAt,
      recipientId: raw.recipientId.toString(),
    };
  }
}

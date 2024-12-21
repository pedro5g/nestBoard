import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/domain/value-objects/unique-entity-id';
import {
  Notification,
  NotificationProps,
} from '@/domain/notification/enterprise/entities/notification';

export function makeNotification(
  override: Partial<NotificationProps> = {},
  id?: UniqueEntityId,
) {
  return Notification.create(
    {
      recipientId: new UniqueEntityId(),
      title: faker.lorem.sentence(1),
      content: faker.lorem.sentence(10),
      ...override,
    },
    id,
  );
}

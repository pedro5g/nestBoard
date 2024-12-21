import { UniqueEntityId } from '@/core/domain/value-objects/unique-entity-id';
import {
  Attachment,
  AttachmentProps,
} from '@/domain/forum/enterprise/entities/attachment';
import { faker } from '@faker-js/faker';

export function makeAttachment(
  override: Partial<AttachmentProps> = {},
  id?: UniqueEntityId,
) {
  return Attachment.create(
    {
      title: faker.lorem.lines(1),
      link: faker.lorem.slug(),
      ...override,
    },
    id,
  );
}

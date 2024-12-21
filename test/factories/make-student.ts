import { UniqueEntityId } from '@/core/domain/value-objects/unique-entity-id';
import {
  Student,
  StudentProps,
} from '@/domain/forum/enterprise/entities/student';
import { faker } from '@faker-js/faker';

export function makeStudent(
  override: Partial<StudentProps> = {},
  id?: UniqueEntityId,
) {
  return Student.create(
    {
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: '123456',
      ...override,
    },
    id,
  );
}

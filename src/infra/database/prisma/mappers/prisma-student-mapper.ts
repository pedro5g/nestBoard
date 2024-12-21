import { UniqueEntityId } from '@/core/domain/value-objects/unique-entity-id';
import { Student } from '@/domain/forum/enterprise/entities/student';
import { User as PrismaStudent, Prisma } from '@prisma/client';

export class PrismaStudentMapper {
  static toDomainFormat(raw: PrismaStudent): Student {
    return Student.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        role: raw.role,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrismaFormat(raw: Student): Prisma.UserUncheckedCreateInput {
    return {
      id: raw.id.toString(),
      name: raw.name,
      email: raw.email,
      password: raw.password,
      role: raw.role as 'STUDENT',
    };
  }
}

import { Optional } from '@/core/types/optional';
import { Entity } from 'src/core/domain/entities/entity';
import { UniqueEntityId } from 'src/core/domain/value-objects/unique-entity-id';

export interface StudentProps {
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Student extends Entity<StudentProps> {
  public static create(
    { createdAt, role, ...props }: Optional<StudentProps, 'createdAt' | 'role'>,
    id?: UniqueEntityId,
  ) {
    return new Student(
      {
        createdAt: createdAt ?? new Date(),
        role: role ?? 'STUDENT',
        ...props,
      },
      id,
    );
  }

  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }
  get role(): string {
    return this.props.role;
  }

  get password(): string {
    return this.props.password;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined | null {
    return this.props.updatedAt;
  }
}

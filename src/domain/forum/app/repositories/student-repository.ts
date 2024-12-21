import { Student } from '../../enterprise/entities/student';

export abstract class StudentRepository {
  abstract create(student: Student): Promise<void>;
  abstract delete(student: Student): Promise<void>;
  abstract update(student: Student): Promise<void>;
  abstract findById(id: string): Promise<Student | null>;
  abstract findByEmail(email: string): Promise<Student | null>;
}

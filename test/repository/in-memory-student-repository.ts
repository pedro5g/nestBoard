import { StudentRepository } from '@/domain/forum/app/repositories/student-repository';
import { Student } from '@/domain/forum/enterprise/entities/student';

export class InMemoryStudentRepository implements StudentRepository {
  private _items: Student[] = [];

  async create(student: Student): Promise<void> {
    this._items.push(student);
  }
  async update(student: Student): Promise<void> {
    const qstIndex = this._items.findIndex((i) => i.id.equals(student.id));
    this._items.splice(qstIndex, 1, student);
  }

  async delete(student: Student): Promise<void> {
    const qstIndex = this._items.findIndex((i) => !i.id.equals(student.id));

    this._items.splice(qstIndex, 1);
  }

  async findByEmail(email: string): Promise<Student | null> {
    return this._items.find((i) => i.email === email) ?? null;
  }

  async findById(id: string): Promise<Student | null> {
    return this._items.find((i) => i.id.toString() === id) ?? null;
  }

  get items(): Student[] {
    return this._items;
  }
}

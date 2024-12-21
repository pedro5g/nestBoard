import { StudentRepository } from '@/domain/forum/app/repositories/student-repository';
import { Student } from '@/domain/forum/enterprise/entities/student';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database.service';
import { PrismaStudentMapper } from '../mappers/prisma-student-mapper';

@Injectable()
export class PrismaStudentRepository implements StudentRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(student: Student): Promise<void> {
    const data = PrismaStudentMapper.toPrismaFormat(student);

    await this.prisma.user.create({
      data,
    });
  }
  async delete(student: Student): Promise<void> {
    await this.prisma.user.delete({ where: { id: student.id.toString() } });
  }
  async update(student: Student): Promise<void> {
    const data = PrismaStudentMapper.toPrismaFormat(student);

    await this.prisma.user.update({
      where: {
        id: data.id,
      },
      data,
    });
  }
  async findById(id: string): Promise<Student | null> {
    const student = await this.prisma.user.findUnique({ where: { id } });

    if (!student) return null;

    return PrismaStudentMapper.toDomainFormat(student);
  }
  async findByEmail(email: string): Promise<Student | null> {
    const student = await this.prisma.user.findUnique({ where: { email } });

    if (!student) return null;

    return PrismaStudentMapper.toDomainFormat(student);
  }
}

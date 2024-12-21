import { StudentProps } from '@/domain/forum/enterprise/entities/student';
import { PrismaService } from '@/infra/database/prisma/database.service';
import { PrismaStudentMapper } from '@/infra/database/prisma/mappers/prisma-student-mapper';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { makeStudent } from 'test/factories/make-student';

@Injectable()
export class MockStudent {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async insertStudentOnDb(__data: Partial<StudentProps> = {}) {
    const student = makeStudent(__data);
    const data = PrismaStudentMapper.toPrismaFormat(student);
    await this.prisma.user.create({ data });

    return student;
  }

  async createSession(__data: Partial<StudentProps> = {}) {
    const student = makeStudent(__data);
    const data = PrismaStudentMapper.toPrismaFormat(student);
    await this.prisma.user.create({ data });

    const accessToken = this.jwt.sign({ sub: student.id.toString() });

    return { student, accessToken };
  }
}

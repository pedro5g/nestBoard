import { Either, left, right } from '@/core/__error/either';
import { Injectable } from '@nestjs/common';
import { StudentRepository } from '../repositories/student-repository';
import { Student } from '../../enterprise/entities/student';
import { Hasher } from '../cryptography/hasher';
import { StudentAlreadyExistsError } from './__errors/student-already-exists-error';

export interface RegisterStudentUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

export type RegisterStudentUseCaseResponse = Either<
  StudentAlreadyExistsError,
  {
    student: Student;
  }
>;

@Injectable()
export class RegisterStudentUseCase {
  constructor(
    private readonly studentRepository: StudentRepository,
    private readonly hasherService: Hasher,
  ) {}
  async execute({
    name,
    email,
    password,
  }: RegisterStudentUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {
    const emailAlreadyRegisteredWithAnotherStudent =
      await this.studentRepository.findByEmail(email);

    if (emailAlreadyRegisteredWithAnotherStudent) {
      return left(new StudentAlreadyExistsError());
    }

    const passwordHash = await this.hasherService.hash(password);

    const student = Student.create({ name, email, password: passwordHash });

    await this.studentRepository.create(student);

    return right({ student });
  }
}

import { Either, left, right } from '@/core/__error/either';
import { Injectable } from '@nestjs/common';
import { StudentRepository } from '../repositories/student-repository';
import { Hasher } from '../cryptography/hasher';
import { Encrypter } from '../cryptography/encrypter';
import { InvalidCredentialsError } from './__errors/invalid-credentials-error';

export interface AuthenticateUseCaseRequest {
  email: string;
  password: string;
}

export type AuthenticateUseCaseResponse = Either<
  InvalidCredentialsError,
  {
    accessToken: string;
  }
>;

@Injectable()
export class AuthenticateUseCase {
  constructor(
    private readonly studentRepository: StudentRepository,
    private readonly hasherService: Hasher,
    private readonly encryperService: Encrypter,
  ) {}
  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const studentExists = await this.studentRepository.findByEmail(email);

    if (!studentExists) {
      return left(new InvalidCredentialsError());
    }

    const isPasswordValid = await this.hasherService.compare(
      password,
      studentExists.password,
    );

    if (!isPasswordValid) {
      return left(new InvalidCredentialsError());
    }

    const token = await this.encryperService.encrypt({
      sub: studentExists.id.toString(),
    });

    return right({ accessToken: token });
  }
}

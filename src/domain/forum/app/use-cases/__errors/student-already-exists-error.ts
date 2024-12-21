import { UseCaseError } from '@/core/__error/use-case-error';

export class StudentAlreadyExistsError extends Error implements UseCaseError {
  constructor(
    message: string = 'Student with same e-mail address already exist',
  ) {
    super(message);
  }
}

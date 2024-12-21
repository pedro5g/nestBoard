import { UseCaseError } from '@/core/__error/use-case-error';

export class InvalidCredentialsError extends Error implements UseCaseError {
  constructor(message: string = 'Email or password are invalid') {
    super(message);
  }
}

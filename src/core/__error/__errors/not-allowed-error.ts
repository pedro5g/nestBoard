import { UseCaseError } from '@/core/__error/use-case-error';

export class NotAllowedError extends Error implements UseCaseError {
  constructor(message: string = 'Not allowed.') {
    super(message);
  }
}

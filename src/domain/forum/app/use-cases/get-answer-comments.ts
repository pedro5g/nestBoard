import { Either, right } from '@/core/__error/either';
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository';
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author';
import { Injectable } from '@nestjs/common';

export interface GetAnswerCommentsRequest {
  page: number;
  answerId: string;
}

export type GetAnswerCommentsResponse = Either<
  null,
  {
    comments: CommentWithAuthor[];
  }
>;

@Injectable()
export class GetAnswerCommentsUseCase {
  constructor(
    private readonly answerCommentsRepository: AnswerCommentsRepository,
  ) {}
  async execute({
    page,
    answerId,
  }: GetAnswerCommentsRequest): Promise<GetAnswerCommentsResponse> {
    const comments =
      await this.answerCommentsRepository.findManyByAnswerIdWithAuthor(
        answerId,
        {
          page,
        },
      );
    return right({ comments });
  }
}

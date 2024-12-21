import { Either, right } from '@/core/__error/either';
import { QuestionCommentsRepository } from '../repositories/question-comments-repository';
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author';
import { Injectable } from '@nestjs/common';

export interface GetQuestionCommentsRequest {
  page: number;
  questionId: string;
}

export type GetQuestionCommentsResponse = Either<
  null,
  {
    comments: CommentWithAuthor[];
  }
>;

@Injectable()
export class GetQuestionCommentsUseCase {
  constructor(
    private readonly questionCommentsRepository: QuestionCommentsRepository,
  ) {}
  async execute({
    page,
    questionId,
  }: GetQuestionCommentsRequest): Promise<GetQuestionCommentsResponse> {
    const comments =
      await this.questionCommentsRepository.findManyByQuestionIdWithAuthor(
        questionId,
        {
          page,
        },
      );
    return right({ comments });
  }
}

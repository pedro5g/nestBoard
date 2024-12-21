import { UniqueEntityId } from '@/core/domain/value-objects/unique-entity-id';
import { AnswerComment } from '../../enterprise/entities/answer-comments';
import { AnswersRepository } from '../repositories/answer-repository';
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository';
import { Either, left, right } from '@/core/__error/either';
import { ResourceNotFoundError } from '../../../../core/__error/__errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';

export interface CommentOnAnswerUseCaseRequest {
  authorId: string;
  answerId: string;
  content: string;
}

export type CommentOnAnswerUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    answerComment: AnswerComment;
  }
>;

@Injectable()
export class CommentOnAnswerUseCase {
  constructor(
    private readonly answersRepository: AnswersRepository,
    private readonly answerCommentsRepository: AnswerCommentsRepository,
  ) {}
  async execute({
    authorId,
    answerId,
    content,
  }: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    const newComment = AnswerComment.create({
      authorId: new UniqueEntityId(authorId),
      answerId: new UniqueEntityId(answerId),
      content,
    });

    await this.answerCommentsRepository.create(newComment);

    return right({
      answerComment: newComment,
    });
  }
}

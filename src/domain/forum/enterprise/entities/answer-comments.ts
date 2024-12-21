import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/domain/value-objects/unique-entity-id';
import { Comment } from './comment';
import { AnswerCommentCreatedEvent } from '../events/answer-comment-created-event';

export interface AnswerCommentProps {
  authorId: UniqueEntityId;
  answerId: UniqueEntityId;
  content: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class AnswerComment extends Comment<AnswerCommentProps> {
  static create(
    props: Optional<AnswerCommentProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const _answerComment = new AnswerComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    const isNewAnswerComment = Boolean(!id);
    if (isNewAnswerComment) {
      _answerComment.addDomainEvent(
        new AnswerCommentCreatedEvent(_answerComment),
      );
    }
    return _answerComment;
  }

  get answerId(): string {
    return this.props.answerId.toString();
  }
}

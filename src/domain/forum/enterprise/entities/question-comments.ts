import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/domain/value-objects/unique-entity-id';
import { Comment } from './comment';
import { QuestionCommentCreatedEvent } from '../events/question-comment-created-event';

export interface QuestionCommentProps {
  authorId: UniqueEntityId;
  questionId: UniqueEntityId;
  content: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class QuestionComment extends Comment<QuestionCommentProps> {
  static create(
    props: Optional<QuestionCommentProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const _questionComment = new QuestionComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    const isNewQuestionComment = Boolean(!id);
    if (isNewQuestionComment) {
      _questionComment.addDomainEvent(
        new QuestionCommentCreatedEvent(_questionComment),
      );
    }

    return _questionComment;
  }

  get questionId(): string {
    return this.props.questionId.toString();
  }
}

import { ValueObject } from '@/core/domain/entities/value-object';
import { UniqueEntityId } from '@/core/domain/value-objects/unique-entity-id';

export interface AnswerWithAuthorProps {
  answerId: UniqueEntityId;
  content: string;
  author: {
    authorId: UniqueEntityId;
    authorName: string;
  };
  createdAt: Date;
  updatedAt?: Date | null;
}

export class AnswerWithAuthor extends ValueObject<AnswerWithAuthorProps> {
  static create(props: AnswerWithAuthorProps) {
    return new AnswerWithAuthor(props);
  }

  get answerId() {
    return this.props.answerId;
  }
  get content() {
    return this.props.content;
  }
  get author() {
    return this.props.author;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
}

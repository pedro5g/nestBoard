import { ValueObject } from '@/core/domain/entities/value-object';
import { UniqueEntityId } from '@/core/domain/value-objects/unique-entity-id';

export interface CommentWithAuthorProps {
  commentId: UniqueEntityId;
  content: string;
  author: {
    authorId: UniqueEntityId;
    authorName: string;
  };
  createdAt: Date;
  updatedAt?: Date | null;
}

export class CommentWithAuthor extends ValueObject<CommentWithAuthorProps> {
  static create(props: CommentWithAuthorProps) {
    return new CommentWithAuthor(props);
  }

  get commentId() {
    return this.props.commentId;
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

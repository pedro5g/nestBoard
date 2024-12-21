import { ValueObject } from '@/core/domain/entities/value-object';
import { Slug } from '@/core/domain/value-objects/slug';
import { UniqueEntityId } from '@/core/domain/value-objects/unique-entity-id';
import { Attachment } from '../attachment';

export interface QuestionDetailsProps {
  questionId: UniqueEntityId;
  title: string;
  content: string;
  slug: Slug;
  attachments: Attachment[];
  bestAnswerId?: UniqueEntityId | null;
  author: {
    authorId: UniqueEntityId;
    authorName: string;
  };
  createdAt: Date;
  updatedAt?: Date | null;
}

export class QuestionDetails extends ValueObject<QuestionDetailsProps> {
  static create(props: QuestionDetailsProps) {
    return new QuestionDetails(props);
  }

  get questionId() {
    return this.props.questionId;
  }
  get title() {
    return this.props.title;
  }
  get content() {
    return this.props.content;
  }
  get slug() {
    return this.props.slug;
  }
  get bestAnswerId() {
    return this.props.bestAnswerId;
  }
  get attachments() {
    return this.props.attachments;
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

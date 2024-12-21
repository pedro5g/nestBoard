import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from 'src/core/domain/value-objects/unique-entity-id';
import { AnswerAttachmentList } from './answer-attachment-list';
import { AggregateRoot } from '@/core/domain/entities/aggregate-root';
import { AnswerCreatedEvent } from '../events/answer-created-event';

export interface AnswerProps {
  authorId: UniqueEntityId;
  questionId: UniqueEntityId;
  attachment: AnswerAttachmentList;
  content: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Answer extends AggregateRoot<AnswerProps> {
  public static create(
    props: Optional<AnswerProps, 'createdAt' | 'attachment'>,
    id?: UniqueEntityId,
  ) {
    const _answer = new Answer(
      {
        ...props,
        attachment: props.attachment ?? new AnswerAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    // check if it is not a reference
    const isNewAnswer = Boolean(!id);

    if (isNewAnswer) {
      _answer.addDomainEvent(new AnswerCreatedEvent(_answer));
    }

    return _answer;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  get shortContent(): string {
    return this.content.substring(0, 120).trimEnd().concat('...');
  }

  public updateContent(content: string) {
    this.props.content = content;
    this.touch();
  }

  public setAttachment(attachments: AnswerAttachmentList): void {
    this.props.attachment = attachments;
    // this.touch();
  }

  get attachment(): AnswerAttachmentList {
    return this.props.attachment;
  }

  get content(): string {
    return this.props.content;
  }

  get authorId(): string {
    return this.props.authorId.value;
  }

  get questionId(): string {
    return this.props.questionId.value;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined | null {
    return this.props.updatedAt;
  }
}

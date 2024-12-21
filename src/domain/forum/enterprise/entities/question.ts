import { Slug } from 'src/core/domain/value-objects/slug';
import { UniqueEntityId } from 'src/core/domain/value-objects/unique-entity-id';
import { Optional } from '@/core/types/optional';
import dayjs from 'dayjs';
import { AggregateRoot } from '@/core/domain/entities/aggregate-root';
import { QuestionAttachmentList } from './question-attachment-list';
import { QuestionBestAnswerChosenEvent } from '../events/question-best-answer-chosen';

export interface QuestionProps {
  title: string;
  slug: Slug;
  content: string;
  attachments: QuestionAttachmentList;
  authorId: UniqueEntityId;
  bestAnswerId?: UniqueEntityId | null;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Question extends AggregateRoot<QuestionProps> {
  public static create(
    {
      createdAt,
      ...props
    }: Optional<QuestionProps, 'createdAt' | 'slug' | 'attachments'>,
    id?: UniqueEntityId,
  ) {
    const _question = new Question(
      {
        ...props,
        slug: props.slug ?? Slug.toSlug(props.title),
        attachments: props.attachments ?? new QuestionAttachmentList(),
        createdAt: createdAt ?? new Date(),
      },
      id,
    );

    const isNewQuestion = Boolean(!id);
    if (isNewQuestion) {
      //TO DO
      // _question.addDomainEvent()
    }

    return _question;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  private updateSlug(text: string) {
    this.props.slug = Slug.toSlug(text);
  }

  public updateContent(content: string) {
    this.props.content = content;
    this.touch();
  }

  public updateTitle(title: string) {
    this.props.title = title;
    this.updateSlug(title);
    this.touch();
  }

  public setBeastAnswerId(id?: UniqueEntityId) {
    if (id === undefined) return;

    if (
      this.props.bestAnswerId === undefined ||
      this.props.bestAnswerId === null ||
      !id.equals(this.props.bestAnswerId)
    ) {
      this.addDomainEvent(new QuestionBestAnswerChosenEvent(this, id));
    }
    this.props.bestAnswerId = id;
    this.touch();
  }

  public setAttachments(attachment: QuestionAttachmentList) {
    this.props.attachments = attachment;
  }

  get isNew(): boolean {
    return dayjs().diff(this.createdAt, 'days') <= 3;
  }

  get shortContent(): string {
    return this.content.substring(0, 120).trimEnd().concat('...');
  }

  get title(): string {
    return this.props.title;
  }

  get content(): string {
    return this.props.content;
  }

  get attachments(): QuestionAttachmentList {
    return this.props.attachments;
  }

  get slug(): Slug {
    return this.props.slug;
  }

  get authorId(): string {
    return this.props.authorId.value;
  }

  get bestAnswerId(): UniqueEntityId | undefined | null {
    return this.props.bestAnswerId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined | null {
    return this.props.updatedAt;
  }
}

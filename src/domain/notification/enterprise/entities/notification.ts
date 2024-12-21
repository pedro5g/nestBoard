import { Entity } from '@/core/domain/entities/entity';
import { UniqueEntityId } from '@/core/domain/value-objects/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface NotificationProps {
  recipientId: UniqueEntityId;
  title: string;
  content: string;
  readAt?: Date | null;
  createdAt: Date;
}

export class Notification extends Entity<NotificationProps> {
  static create(
    props: Optional<NotificationProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    return new Notification(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
  }

  public read(): void {
    this.props.readAt = new Date();
  }

  get recipientId() {
    return this.props.recipientId;
  }
  get title() {
    return this.props.title;
  }
  get content() {
    return this.props.content;
  }
  get readAt() {
    return this.props.readAt;
  }
  get createdAt() {
    return this.props.createdAt;
  }
}

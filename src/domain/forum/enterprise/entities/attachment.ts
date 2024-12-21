import { Entity } from '@/core/domain/entities/entity';
import { UniqueEntityId } from '@/core/domain/value-objects/unique-entity-id';

export interface AttachmentProps {
  title: string;
  link: string;
}

export class Attachment extends Entity<AttachmentProps> {
  static create(props: AttachmentProps, id?: UniqueEntityId) {
    return new Attachment(props, id);
  }

  get title(): string {
    return this.props.title;
  }

  get link(): string {
    return this.props.title;
  }
}

import { DomainEvent } from '@/core/events/domain-event';
import { UniqueEntityId } from '@/core/domain/value-objects/unique-entity-id';
import { QuestionComment } from '../entities/question-comments';

export class QuestionCommentCreatedEvent implements DomainEvent {
  public ocurredAt: Date;
  private aggregate: QuestionComment;

  constructor(aggregate: QuestionComment) {
    this.aggregate = aggregate;
    this.ocurredAt = new Date();
  }

  public getAggregateId(): UniqueEntityId {
    return this.aggregate.id;
  }

  get questionComment(): QuestionComment {
    return this.aggregate;
  }
}

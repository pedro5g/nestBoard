import { DomainEvent } from '@/core/events/domain-event';
import { AnswerComment } from '../entities/answer-comments';
import { UniqueEntityId } from '@/core/domain/value-objects/unique-entity-id';

export class AnswerCommentCreatedEvent implements DomainEvent {
  public ocurredAt: Date;
  private aggregate: AnswerComment;

  constructor(aggregate: AnswerComment) {
    this.aggregate = aggregate;
    this.ocurredAt = new Date();
  }

  public getAggregateId(): UniqueEntityId {
    return this.aggregate.id;
  }

  get answerComment(): AnswerComment {
    return this.aggregate;
  }
}

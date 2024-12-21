import { UniqueEntityId } from '@/core/domain/value-objects/unique-entity-id';
import { DomainEvent } from '@/core/events/domain-event';
import { Answer } from '../entities/answer';

export class AnswerCreatedEvent implements DomainEvent {
  private aggregate: Answer;
  public ocurredAt: Date;

  constructor(aggregate: Answer) {
    this.aggregate = aggregate;
    this.ocurredAt = new Date();
  }

  public getAggregateId(): UniqueEntityId {
    return this.aggregate.id;
  }

  get answer(): Answer {
    return this.aggregate;
  }
}

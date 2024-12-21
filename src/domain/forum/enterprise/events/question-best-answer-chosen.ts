import { UniqueEntityId } from '@/core/domain/value-objects/unique-entity-id';
import { DomainEvent } from '@/core/events/domain-event';
import { Question } from '../entities/question';

export class QuestionBestAnswerChosenEvent implements DomainEvent {
  private aggregate: Question;
  private _bestAnswerId: UniqueEntityId;
  public ocurredAt: Date;

  constructor(aggregate: Question, bestAnswerId: UniqueEntityId) {
    this.aggregate = aggregate;
    this._bestAnswerId = bestAnswerId;
    this.ocurredAt = new Date();
  }

  public getAggregateId(): UniqueEntityId {
    return this.aggregate.id;
  }

  get question(): Question {
    return this.aggregate;
  }
  get bestAnswerId(): UniqueEntityId {
    return this._bestAnswerId;
  }
}

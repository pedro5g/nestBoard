import { AggregateRoot } from '../domain/entities/aggregate-root';
import { UniqueEntityId } from '../domain/value-objects/unique-entity-id';
import { DomainEvent } from './domain-event';
import { DomainEvents } from './domain-events';

class CustomAggregateEvent implements DomainEvent {
  public ocurredAt: Date;
  private aggregate: CustomAggregate;

  constructor(aggregate: CustomAggregate) {
    this.aggregate = aggregate;
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityId {
    return this.aggregate.id;
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null);
    aggregate.addDomainEvent(new CustomAggregateEvent(aggregate));
    return aggregate;
  }
}

describe('Domain Events Tests', () => {
  it('should be able to dispatch abd listen to events', () => {
    const callbackSpy = vitest.fn();
    DomainEvents.register(CustomAggregateEvent.name, callbackSpy);

    const aggregate = CustomAggregate.create();
    expect(aggregate.domainEvents).toHaveLength(1);
    DomainEvents.dispatchEventsForAggregate(aggregate.id);
    expect(callbackSpy).toBeCalled();
    expect(aggregate.domainEvents).toHaveLength(0);
  });
});

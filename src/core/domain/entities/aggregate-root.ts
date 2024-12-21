import { DomainEvent } from '@/core/events/domain-event';
import { Entity } from './entity';
import { DomainEvents } from '@/core/events/domain-events';

export abstract class AggregateRoot<T> extends Entity<T> {
  // keep all events
  private _domainEvents: DomainEvent[] = [];

  protected addDomainEvent(domainEvent: DomainEvent): void {
    // add to domain events list
    this._domainEvents.push(domainEvent);
    // mark as pendent event to dispatch
    DomainEvents.markAggregateForDispatch(this); // 'this' referes to the class itself
  }

  public clearEvents() {
    this._domainEvents = [];
  }

  get domainEvents(): DomainEvent[] {
    return this._domainEvents;
  }
}

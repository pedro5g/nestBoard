import { AggregateRoot } from '../domain/entities/aggregate-root';
import { UniqueEntityId } from '../domain/value-objects/unique-entity-id';
import { DomainEvent } from './domain-event';

type DomainEventCallback = <T>(event: T) => void;

export class DomainEvents {
  // list events name and events functions
  private static handlesMap: Record<string, DomainEventCallback[]> = {};
  // list all aggregates has pendents events
  private static markedAggregates: AggregateRoot<any>[] = [];

  public static shouldRun = true;

  public static markAggregateForDispatch(aggregate: AggregateRoot<any>) {
    // trying to find a aggregate to aggregate id
    const aggregateFound = !!this.findMarkedAggregateById(aggregate.id);

    // checks if aggregateFound it's to equal false
    if (!aggregateFound) {
      // then add to marked aggregates list
      this.markedAggregates.push(aggregate);
    }
  }

  private static dispatchAggregateEvents(aggregate: AggregateRoot<any>) {
    aggregate.domainEvents.forEach((event) => this.dispatch(event));
  }

  private static removeAggregateFromMarkedDispatchList(
    aggregate: AggregateRoot<any>,
  ) {
    const index = this.markedAggregates.findIndex((a) => a.equals(aggregate));
    this.markedAggregates.splice(index, 1);
  }

  private static findMarkedAggregateById(
    id: UniqueEntityId,
  ): AggregateRoot<any> | undefined {
    return this.markedAggregates.find((aggregate) => aggregate.id.equals(id));
  }

  public static dispatchEventsForAggregate(id: UniqueEntityId) {
    const aggregate = this.findMarkedAggregateById(id);

    if (aggregate) {
      this.dispatchAggregateEvents(aggregate);
      aggregate.clearEvents();
      this.removeAggregateFromMarkedDispatchList(aggregate);
    }
  }

  public static register(
    eventClassName: string,
    callback: DomainEventCallback,
  ) {
    // checks if eventClassName exists within handlesMap
    const wasEventRegisteredBefore = eventClassName in this.handlesMap;

    if (!wasEventRegisteredBefore) {
      this.handlesMap[eventClassName] = [];
    }

    this.handlesMap[eventClassName].push(callback);
  }

  public static clearHandles() {
    this.handlesMap = {};
  }

  public static clearMarkedAggregates() {
    this.markedAggregates = [];
  }

  private static dispatch(event: DomainEvent) {
    // gets class name by it constructor
    const eventClassName = event.constructor.name;

    //checks if eventClassName exists within handlesMap
    const isEventRegistered = eventClassName in this.handlesMap;

    if (!this.shouldRun) return;

    if (isEventRegistered) {
      // gets all handles function
      const handles = this.handlesMap[eventClassName];

      // then iterable for each function
      handles.forEach((handle) => {
        handle(event);
      });
    }
  }
}

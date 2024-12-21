export abstract class WatchedList<T> {
  public currentItems: T[];
  private initial: T[];
  private new: T[];
  private removed: T[];

  constructor(initialItems?: T[]) {
    this.currentItems = initialItems || [];
    this.initial = initialItems || [];
    this.new = [];
    this.removed = [];
  }

  abstract compareItems(a: T, b: T): boolean;

  public getItems(): T[] {
    return this.currentItems;
  }

  public getNewItems(): T[] {
    return this.new;
  }

  public getRemovedItems(): T[] {
    return this.removed;
  }

  ///////////////////////////////////////////////////////////////////
  //// This methods checks if filter result was different then 0 ///
  /////////////////////////////////////////////////////////////////
  private isCurrentItem(item: T): boolean {
    return (
      this.currentItems.filter((v) => this.compareItems(item, v)).length !== 0
    );
  }
  private isNewItem(item: T): boolean {
    return this.new.filter((v) => this.compareItems(item, v)).length !== 0;
  }

  private isRemovedItem(item: T): boolean {
    return this.removed.filter((v) => this.compareItems(item, v)).length !== 0;
  }

  private wasAddedInitially(item: T): boolean {
    return this.initial.filter((v) => this.compareItems(item, v)).length !== 0;
  }

  /////////////////////////////////////////////////////////////////////////////////////
  //// This methods checks if filter result was true to remove item to list    ///////
  ///////////////////////////////////////////////////////////////////////////////////
  private removeFromCurrent(item: T): void {
    this.currentItems = this.currentItems.filter(
      (v) => !this.compareItems(item, v),
    );
  }

  private removeFromNew(item: T): void {
    this.new = this.new.filter((v) => !this.compareItems(item, v));
  }

  private removeFromRemoved(item: T): void {
    this.removed = this.removed.filter((v) => !this.compareItems(item, v));
  }

  /// checks if item already exists within current items list
  public exists(item: T): boolean {
    return this.isCurrentItem(item);
  }

  // add new item
  public add(item: T): void {
    //checks if item added is a removed items
    if (this.isRemovedItem(item)) {
      // then remove it, from removed list
      this.removeFromRemoved(item);
    }
    // checks if item is not a new item and is not added to initially
    if (!this.isNewItem(item) && !this.wasAddedInitially(item)) {
      // then add within a new items list
      this.new.push(item);
    }

    // checks if item is not exits within current item list
    if (!this.isCurrentItem(item)) {
      // then add it in list
      this.currentItems.push(item);
    }
  }

  // remove item
  public remove(item: T): void {
    // remove item from current items list
    this.removeFromCurrent(item);

    // checks if item is a new item
    if (this.isNewItem(item)) {
      // then remove it from list
      this.removeFromNew(item);

      // then return, because if it's a new item, if not exists in a current item list

      return;
    }

    // checks if item is not removed item
    if (!this.isRemovedItem(item)) {
      // then, add within a removed items list
      this.removed.push(item);
    }
  }

  // update items
  public update(items: T[]): void {
    // set in a new list all new items
    const newItems = items.filter((a) => {
      return !this.getItems().some((b) => this.compareItems(a, b));
    });
    // set in a new list all removed items
    const removedItems = this.getItems().filter((a) => {
      return !items.some((b) => this.compareItems(a, b));
    });

    // to set all new values
    this.currentItems = items;
    this.new = newItems;
    this.removed = removedItems;
  }
}

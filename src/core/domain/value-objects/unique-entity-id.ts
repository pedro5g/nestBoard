import { randomUUID } from 'crypto';

export class UniqueEntityId {
  private _value: string;

  constructor(value?: string) {
    this._value = value ?? randomUUID();
  }

  public toString() {
    return this._value;
  }

  get value() {
    return this._value;
  }

  public equals(id: UniqueEntityId) {
    return id.value === this.value;
  }
}

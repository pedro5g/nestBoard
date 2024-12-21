import { Entity } from 'src/core/domain/entities/entity';
import { UniqueEntityId } from 'src/core/domain/value-objects/unique-entity-id';

export interface InstructorProps {
  name: string;
}

export class Instructor extends Entity<InstructorProps> {
  public static create(props: InstructorProps, id?: UniqueEntityId) {
    return new Instructor(props, id);
  }

  get name(): string {
    return this.props.name;
  }
}

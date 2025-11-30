import { AggregateRoot } from '@nestjs/cqrs'; 
import { PropertyCreatedEvent } from '../events/property-created.event';

export class Property {
  // We keep the constructor private to force usage of factory methods
  constructor(
    private readonly id: string,
    private readonly ownerId: string,
    private title: string,
    private description: string,
    private price: number,
    private createdAt: Date,
    private updatedAt: Date,
    // Add more fields (address, bathrooms, etc) as project grows
  ) {}

  // Factory Method: Creates new property AND registers the event
  static create(
    ownerId: string,
    title: string,
    description: string,
    price: number,
  ): { property: Property; event: PropertyCreatedEvent } {
    const id = crypto.randomUUID();
    const property = new Property(
      id,
      ownerId,
      title,
      description,
      price,
      new Date(),
      new Date(),
    );

    // Create the event (The Application layer will dispatch this later)
    const event = new PropertyCreatedEvent(id, ownerId, title, description);

    return { property, event };
  }

  // Reconstitute from DB (No event triggered)
  static restore(
    id: string,
    ownerId: string,
    title: string,
    description: string,
    price: number,
    createdAt: Date,
    updatedAt: Date,
  ): Property {
    return new Property(
      id,
      ownerId,
      title,
      description,
      price,
      createdAt,
      updatedAt,
    );
  }

  // Getters
  getId(): string {
    return this.id;
  }
  getOwnerId(): string {
    return this.ownerId;
  }
  getTitle(): string {
    return this.title;
  }
  getDescription(): string {
    return this.description;
  }
  getPrice(): number {
    return this.price;
  }
}

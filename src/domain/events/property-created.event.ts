export class PropertyCreatedEvent {
  constructor(
    public readonly propertyId: string,
    public readonly ownerId: string,
    public readonly title: string,
    public readonly description: string,
    // We pass data needed for Vector Embedding
  ) {}
}
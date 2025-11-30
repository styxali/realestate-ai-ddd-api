import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Property } from '../../domain/model/property';
import { IPropertyRepository } from '../../domain/repositories/property.repository.interface';
import { PropertyCreatedEvent } from '../../domain/events/property-created.event';

export interface CreatePropertyDto {
  ownerId: string;
  title: string;
  description: string;
  price: number;
}

@Injectable()
export class CreatePropertyUseCase {
  constructor(
    @Inject('IPropertyRepository') private readonly propertyRepo: IPropertyRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(dto: CreatePropertyDto): Promise<Property> {
    // 1. Create Domain Entity
    const { property, event } = Property.create(
      dto.ownerId,
      dto.title,
      dto.description,
      dto.price,
    );

    // 2. Persist to Primary DB (Postgres/SQLite)
    await this.propertyRepo.save(property);

    // 3. Dispatch Event (Fire and Forget - The Listener handles the AI work)
    // The second argument { async: true } ensures the API response isn't blocked by OpenAI
    this.eventEmitter.emit('property.created', event);

    return property;
  }
}
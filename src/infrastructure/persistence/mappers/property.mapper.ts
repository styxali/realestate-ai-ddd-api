import { Property as PrismaProperty } from '@prisma/client';
import { Property } from '../../../domain/model/property';

export class PropertyMapper {
  static toDomain(raw: PrismaProperty): Property {
    return Property.restore(
      raw.id,
      raw.ownerId,
      raw.title,
      raw.description,
      raw.price,
      raw.createdAt,
      raw.updatedAt,
    );
  }

  static toPersistence(domain: Property): PrismaProperty {
    return {
      id: domain.getId(),
      ownerId: domain.getOwnerId(),
      title: domain.getTitle(),
      description: domain.getDescription(),
      price: domain.getPrice(),
      createdAt: new Date(), // Managed by DB mostly
      updatedAt: new Date(),
    };
  }
}
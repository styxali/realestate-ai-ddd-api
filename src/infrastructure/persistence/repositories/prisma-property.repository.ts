import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { IPropertyRepository } from '../../../domain/repositories/property.repository.interface';
import { Property } from '../../../domain/model/property';
import { PropertyMapper } from '../mappers/property.mapper';

@Injectable()
export class PrismaPropertyRepository implements IPropertyRepository {
  private prisma = new PrismaClient();

  async save(property: Property): Promise<void> {
    const data = PropertyMapper.toPersistence(property);
    await this.prisma.property.upsert({
      where: { id: data.id },
      update: data,
      create: data,
    });
  }

  async findAll(filter?: { ownerId?: string }): Promise<Property[]> {
    const whereClause = filter?.ownerId ? { ownerId: filter.ownerId } : {};

    const raw = await this.prisma.property.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });
    return raw.map(PropertyMapper.toDomain);
  }

  async findById(id: string): Promise<Property | null> {
    const raw = await this.prisma.property.findUnique({ where: { id } });
    if (!raw) return null;
    return PropertyMapper.toDomain(raw);
  }

  async findByOwner(ownerId: string): Promise<Property[]> {
    const raw = await this.prisma.property.findMany({ where: { ownerId } });
    return raw.map(PropertyMapper.toDomain);
  }
}

import { Property } from '../model/property';

export interface IPropertyRepository {
  save(property: Property): Promise<void>;
  findAll(): Promise<Property[]>;
  findById(id: string): Promise<Property | null>;
  findByOwner(ownerId: string): Promise<Property[]>;
}
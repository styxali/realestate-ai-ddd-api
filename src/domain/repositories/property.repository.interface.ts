import { Property } from '../model/property';

export interface IPropertyRepository {
  save(property: Property): Promise<void>;
  findAll(filter?: { ownerId?: string }): Promise<Property[]>; // <--- CHANGED
  findById(id: string): Promise<Property | null>;
  count(): Promise<number>;
}
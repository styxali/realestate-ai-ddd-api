import { Inject, Injectable } from '@nestjs/common';
import { Property } from '../../domain/model/property';
import { UserRole } from '../../domain/model/user';
import { IPropertyRepository } from '../../domain/repositories/property.repository.interface';

// We define a context interface for what we know about the user
export interface UserContext {
  id: string;
  role: UserRole;
  managerId?: string;
}

@Injectable()
export class ListPropertiesUseCase {
  constructor(
    @Inject('IPropertyRepository') private readonly propertyRepo: IPropertyRepository,
  ) {}

  async execute(user: UserContext): Promise<Property[]> {
    // 1. ADMIN: Sees everything
    if (user.role === UserRole.ADMIN) {
      return this.propertyRepo.findAll();
    }

    // 2. OWNER: Sees only their own properties
    if (user.role === UserRole.OWNER) {
      return this.propertyRepo.findAll({ ownerId: user.id });
    }

    // 3. AGENT: Sees their Manager's properties
    if (user.role === UserRole.AGENT) {
      if (!user.managerId) {
         // Edge case: Agent has no manager (orphan). Should return empty or throw.
         return []; 
      }
      return this.propertyRepo.findAll({ ownerId: user.managerId });
    }

    // 4. Regular Users: In this specific project context, maybe they see nothing?
    // Or maybe they see public listings. Assuming "Backend for Owner Area" here.
    return [];
  }
}
import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { IPropertyRepository } from '../../domain/repositories/property.repository.interface';

@Injectable()
export class AdminStatsUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepo: IUserRepository,
    @Inject('IPropertyRepository') private readonly propertyRepo: IPropertyRepository,
  ) {}

  async execute() {
    const [users, properties] = await Promise.all([
      this.userRepo.count(),
      this.propertyRepo.count(),
    ]);

    return {
      totalUsers: users,
      totalProperties: properties,
      systemStatus: 'Healthy', // Placeholder
    };
  }
}
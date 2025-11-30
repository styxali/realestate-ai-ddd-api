import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/model/user';

@Injectable()
export class AdminManageUserUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepo: IUserRepository,
  ) {}

  async execute(userId: string, action: 'ban' | 'unban'): Promise<void> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    // We need to mutate the domain entity. 
    // Ideally, User entity should have methods like .deactivate()
    // For now, we will hack it via a setter or re-instantiation logic, 
    // but the cleanest DDD way is a method on the Entity.
    
    // Let's assume we add methods to User entity:
    if (action === 'ban') user.deactivate(); 
    else user.activate();

    await this.userRepo.save(user);
  }
}
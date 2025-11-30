import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { User, UserRole } from '../../domain/model/user';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { IPasswordService } from '../ports/password.service.interface';

// Input DTO (Simple interface for arguments)
export interface CreateUserDto {
  email: string;
  password: string;
  role: UserRole;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    // We inject INTERFACES, not classes. We use strings/symbols as tokens for DI.
    @Inject('IUserRepository') private readonly userRepo: IUserRepository,
    @Inject('IPasswordService') private readonly passwordService: IPasswordService,
  ) {}

  async execute(dto: CreateUserDto): Promise<User> {
    // 1. Check if user exists
    const existingUser = await this.userRepo.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // 2. Hash password (Infrastructure concern delegated to adapter)
    const hashedPassword = await this.passwordService.hash(dto.password);

    // 3. Create Domain Entity
    const user = User.create(dto.email, hashedPassword, dto.role);

    // 4. Persist
    await this.userRepo.save(user);

    return user;
  }
}
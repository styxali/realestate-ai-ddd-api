// src/infrastructure/persistence/mappers/user.mapper.ts
import { User as PrismaUser } from '@prisma/client';
import { User, UserRole } from '../../../domain/model/user';

export class UserMapper {
  static toDomain(raw: PrismaUser): User {
    return User.restore(
      raw.id,
      raw.email,
      raw.password,
      raw.role as UserRole, // Cast string to Enum
      raw.isActive,
      raw.createdAt,
    );
  }

  static toPersistence(domain: User): PrismaUser {
    return {
      id: domain.getId(),
      email: domain.getEmail(),
      password: domain.getPasswordHash(),
      role: domain.getRole(),
      isActive: domain.getIsActive(),
      createdAt: new Date(), // In update scenarios this might be ignored by Prisma
      updatedAt: new Date(),
    };
  }
}
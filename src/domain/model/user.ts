// src/domain/model/user.ts

export enum UserRole {
  ADMIN = 'ADMIN',
  OWNER = 'OWNER',
  AGENT = 'AGENT',
  USER = 'USER',
}

// Value Object for granular permissions (scalable for later)
export type Permission = 'manage_users' | 'create_listing' | 'edit_listing' | 'view_listing';

export class User {
  constructor(
    private readonly id: string,
    private email: string,
    private passwordHash: string, // We never store plain text
    private role: UserRole,
    private isActive: boolean,
    private createdAt: Date,
  ) {}

  // Factory method to create a NEW user (cleaner than new User(...))
  static create(email: string, passwordHash: string, role: UserRole): User {
    return new User(
      crypto.randomUUID(), // Node generic UUID
      email,
      passwordHash,
      role,
      true,
      new Date(),
    );
  }

  // Method to reconstitute user from DB (Infrastructure -> Domain)
  static restore(id: string, email: string, passwordHash: string, role: UserRole, isActive: boolean, createdAt: Date): User {
    return new User(id, email, passwordHash, role, isActive, createdAt);
  }

  // Business Logic: Check capabilities
  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  isOwner(): boolean {
    return this.role === UserRole.OWNER;
  }

  // Getters
  getId(): string { return this.id; }
  getEmail(): string { return this.email; }
  getPasswordHash(): string { return this.passwordHash; }
  getRole(): UserRole { return this.role; }
  getIsActive(): boolean { return this.isActive; }
}
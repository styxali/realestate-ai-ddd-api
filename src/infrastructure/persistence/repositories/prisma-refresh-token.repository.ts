import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { IRefreshTokenRepository, RefreshTokenEntity } from '../../../domain/repositories/refresh-token.repository.interface';

@Injectable()
export class PrismaRefreshTokenRepository implements IRefreshTokenRepository {
  private prisma = new PrismaClient();

  async create(userId: string, tokenHash: string, expiresAt: Date): Promise<void> {
    await this.prisma.refreshToken.create({
      data: { userId, tokenHash, expiresAt },
    });
  }

  async findLatest(userId: string): Promise<RefreshTokenEntity | null> {
    // We might match by specific ID in a real scenario, but for now finding by User is okay
    // Actually, for rotation, we need to match the specific token being presented.
    // Let's change this to find by User to scan, or we just rely on ID passed if using JWT.
    // Better approach for Opaque tokens: We will scan the user's tokens in the UseCase.
    return null; // Placeholder, we will use a different finder in implementation
  }

  // Helper to find a specific token by ID (if we embed ID in the token)
  // Or simply find by userId and compare hashes (slower but safer)
  async findAllByUserId(userId: string): Promise<RefreshTokenEntity[]> {
    return this.prisma.refreshToken.findMany({ where: { userId } });
  }

  async revoke(id: string): Promise<void> {
    await this.prisma.refreshToken.delete({ where: { id } }).catch(() => null);
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({ where: { userId } });
  }
}
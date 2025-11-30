import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';
import { IRefreshTokenRepository } from '../../domain/repositories/refresh-token.repository.interface';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { IPasswordService } from '../ports/password.service.interface';
import { ITokenService } from '../ports/token.service.interface';
import { UserMapper } from '../../infrastructure/persistence/mappers/user.mapper'; // Or use interface

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject('IRefreshTokenRepository') private readonly refreshTokenRepo: IRefreshTokenRepository,
    @Inject('IUserRepository') private readonly userRepo: IUserRepository,
    @Inject('IPasswordService') private readonly passwordService: IPasswordService,
    @Inject('ITokenService') private readonly tokenService: ITokenService,
  ) {}

  async execute(userId: string, plainRefreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    // 1. Get all active tokens for user
    // (In a highly optimized system, we might store the Token ID in the frontend to lookup directly, 
    // but iterating a few tokens per user is fine for now)
    const tokens = await (this.refreshTokenRepo as any).findAllByUserId(userId); 

    let matchedTokenId = null;

    // 2. Find the matching token
    for (const token of tokens) {
      const isMatch = await this.passwordService.compare(plainRefreshToken, token.tokenHash);
      if (isMatch) {
        matchedTokenId = token.id;
        break;
      }
    }

    if (!matchedTokenId) {
      // Security Alert: User sent an invalid token. 
      // Reuse Detection: Could revoke ALL tokens here if desired.
      throw new UnauthorizedException('Invalid Refresh Token');
    }

    // 3. ROTATION: Delete the used token immediately
    await this.refreshTokenRepo.revoke(matchedTokenId);

    // 4. Issue NEW pair
    const user = await this.userRepo.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');

    const payload = { sub: user.getId(), email: user.getEmail(), role: user.getRole() };
    const newAccessToken = this.tokenService.sign(payload);

    const newRefreshTokenPlain = crypto.randomBytes(32).toString('hex');
    const newRefreshTokenHash = await this.passwordService.hash(newRefreshTokenPlain);
    
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.refreshTokenRepo.create(user.getId(), newRefreshTokenHash, expiresAt);

    return { accessToken: newAccessToken, refreshToken: newRefreshTokenPlain };
  }
}
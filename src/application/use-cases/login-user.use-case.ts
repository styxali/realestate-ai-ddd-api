import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { IPasswordService } from '../ports/password.service.interface';
import { ITokenService } from '../ports/token.service.interface';


import * as crypto from 'crypto';
import { IRefreshTokenRepository } from '../../domain/repositories/refresh-token.repository.interface';

export interface LoginUserDto {
  email: string;
  password: string;
}

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepo: IUserRepository,
    @Inject('IPasswordService') private readonly passwordService: IPasswordService,
    @Inject('ITokenService') private readonly tokenService: ITokenService,
    // Add new repo
    @Inject('IRefreshTokenRepository') private readonly refreshTokenRepo: IRefreshTokenRepository,
  ) {}

  async execute(dto: LoginUserDto): Promise<{ accessToken: string; refreshToken: string }> {
    // 1. Verify User (Existing logic) ...
    const user = await this.userRepo.findByEmail(dto.email);
    // ... password check ...
    
    // 2. Generate Access Token (15 mins)
    const payload = { sub: user.getId(), email: user.getEmail(), role: user.getRole() };
    const accessToken = this.tokenService.sign(payload); // Ensure config is set to 15m

    // 3. Generate Refresh Token (Random Hex)
    const refreshTokenPlain = crypto.randomBytes(32).toString('hex');
    const refreshTokenHash = await this.passwordService.hash(refreshTokenPlain);

    // 4. Save Hash to DB (Expires in 7 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    await this.refreshTokenRepo.create(user.getId(), refreshTokenHash, expiresAt);

    return { accessToken, refreshToken: refreshTokenPlain };
  }
}
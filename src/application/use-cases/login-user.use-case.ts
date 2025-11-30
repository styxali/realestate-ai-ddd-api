import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { IPasswordService } from '../ports/password.service.interface';
import { ITokenService } from '../ports/token.service.interface';

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
  ) {}

  async execute(dto: LoginUserDto): Promise<{ accessToken: string }> {
    // 1. Find User
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2. Validate Password
    const isValid = await this.passwordService.compare(dto.password, user.getPasswordHash());
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. Generate Token
    const payload = { sub: user.getId(), email: user.getEmail(), role: user.getRole() };
    const accessToken = this.tokenService.sign(payload);

    return { accessToken };
  }
}
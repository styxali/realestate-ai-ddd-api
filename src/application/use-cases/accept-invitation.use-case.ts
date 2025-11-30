import { Inject, Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { User } from '../../domain/model/user';
import { IInvitationRepository } from '../../domain/repositories/invitation.repository.interface';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { IPasswordService } from '../ports/password.service.interface';

@Injectable()
export class AcceptInvitationUseCase {
  constructor(
    @Inject('IInvitationRepository') private readonly invitationRepo: IInvitationRepository,
    @Inject('IUserRepository') private readonly userRepo: IUserRepository,
    @Inject('IPasswordService') private readonly passwordService: IPasswordService,
  ) {}

  async execute(token: string, password: string): Promise<User> {
    // 1. Validate Token
    const invitation = await this.invitationRepo.findByToken(token);
    if (!invitation || invitation.getStatus() !== 'PENDING') {
      throw new NotFoundException('Invalid or expired invitation');
    }

    // 2. Check if user already exists (Safety check)
    const existing = await this.userRepo.findByEmail(invitation.getEmail());
    if (existing) {
      throw new ConflictException('User already exists');
    }

    // 3. Create Agent Entity
    const hashedPassword = await this.passwordService.hash(password);
    const newAgent = User.createAgent(
      invitation.getEmail(), 
      hashedPassword, 
      invitation.getOwnerId()
    );

    // 4. Update Invitation Status
    invitation.markAccepted();

    // 5. Transactional Save (Ideally wrapped in a transaction, separate calls for now)
    await this.userRepo.save(newAgent);
    await this.invitationRepo.save(invitation);

    return newAgent;
  }
}
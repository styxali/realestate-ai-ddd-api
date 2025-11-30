import { Inject, Injectable } from '@nestjs/common';
import { Invitation } from '../../domain/model/invitation';
import { IInvitationRepository } from '../../domain/repositories/invitation.repository.interface';

@Injectable()
export class InviteAgentUseCase {
  constructor(
    @Inject('IInvitationRepository') private readonly invitationRepo: IInvitationRepository,
    // Inject EmailService here later to actually send the mail
  ) {}

  async execute(ownerId: string, email: string): Promise<string> {
    // 1. Create Domain Entity
    const invitation = Invitation.create(email, ownerId);

    // 2. Save to DB
    await this.invitationRepo.save(invitation);

    // 3. Mock Email Sending (Log to console)
    console.log(`[EmailService] Sending invite to ${email}. Link: https://app.com/join?token=${invitation.getToken()}`);

    return invitation.getToken();
  }
}
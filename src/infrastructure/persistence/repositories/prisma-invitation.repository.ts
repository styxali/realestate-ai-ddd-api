import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { IInvitationRepository } from '../../../domain/repositories/invitation.repository.interface';
import { Invitation, InvitationStatus } from '../../../domain/model/invitation';

@Injectable()
export class PrismaInvitationRepository implements IInvitationRepository {
  private prisma = new PrismaClient();

  async save(invitation: Invitation): Promise<void> {
    await this.prisma.invitation.create({
      data: {
        id: invitation.getId(),
        email: invitation.getEmail(),
        token: invitation.getToken(),
        ownerId: invitation.getOwnerId(),
        status: 'PENDING',
      },
    });
  }

  async findByToken(token: string): Promise<Invitation | null> {
    const raw = await this.prisma.invitation.findUnique({ where: { token } });
    if (!raw) return null;
    return new Invitation(
        raw.id, raw.email, raw.token, raw.ownerId, 
        raw.status as InvitationStatus, raw.createdAt
    );
  }
}
import { Module } from '@nestjs/common';
import { TeamController } from '../controllers/team.controller';
import { InviteAgentUseCase } from '../../application/use-cases/invite-agent.use-case';
import { PrismaInvitationRepository } from '../persistence/repositories/prisma-invitation.repository';

@Module({
  controllers: [TeamController],
  providers: [
    InviteAgentUseCase,
    {
      provide: 'IInvitationRepository',
      useClass: PrismaInvitationRepository,
    },
  ],
})
export class TeamModule {}
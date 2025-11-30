import { Module } from '@nestjs/common';
import { TeamController } from '../controllers/team.controller';
import { InviteAgentUseCase } from '../../application/use-cases/invite-agent.use-case';
import { PrismaInvitationRepository } from '../persistence/repositories/prisma-invitation.repository';
import { UserModule } from './user.module';
import { AcceptInvitationUseCase } from 'src/application/use-cases/accept-invitation.use-case';
@Module({
    imports: [UserModule],
  controllers: [TeamController],
  providers: [
    InviteAgentUseCase,
    AcceptInvitationUseCase,
    {
      provide: 'IInvitationRepository',
      useClass: PrismaInvitationRepository,
    },
  ],
})
export class TeamModule {}
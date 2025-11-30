import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../../domain/model/user';
import { InviteAgentUseCase } from '../../application/use-cases/invite-agent.use-case';
import { AcceptInvitationUseCase } from 'src/application/use-cases/accept-invitation.use-case';

@Controller('teams')
export class TeamController {
  constructor(private readonly inviteAgentUseCase: InviteAgentUseCase,
    private readonly acceptInvitationUseCase: AcceptInvitationUseCase, 
  ) {}

  @Post('invite')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.OWNER) // Only Owners can invite
  async inviteAgent(@Body() body: { email: string }, @Request() req: any) {
    const token = await this.inviteAgentUseCase.execute(req.user.id, body.email);
    
    return {
      message: 'Invitation sent',
      // We return the token for testing purposes, but in Prod, never return this! 
      // It should only go to the email.
      debugToken: token 
    };
  }

  @Post('accept')
  // No AuthGuard! This is a public endpoint for new users.
  async acceptInvite(@Body() body: { token: string, password: string }) {
    await this.acceptInvitationUseCase.execute(body.token, body.password);
    return { message: 'Agent account created successfully. Please login.' };
  }
}
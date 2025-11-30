import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../../domain/model/user';
import { AdminManageUserUseCase } from '../../application/use-cases/admin-manage-user.use-case';
import { AdminStatsUseCase } from '../../application/use-cases/admin-stats.use-case';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN) 
export class AdminController {
  constructor(
    private readonly manageUserUseCase: AdminManageUserUseCase,
    private readonly statsUseCase: AdminStatsUseCase,
  ) {}

  @Get('stats')
  async getStats() {
    return this.statsUseCase.execute();
  }

  @Patch('users/:id/status')
  async changeStatus(@Param('id') id: string, @Body() body: { action: 'ban' | 'unban' }) {
    await this.manageUserUseCase.execute(id, body.action);
    return { message: `User ${body.action}ned successfully` };
  }
}
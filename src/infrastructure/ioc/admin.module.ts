import { Module } from '@nestjs/common';
import { AdminController } from '../controllers/admin.controller';
import { AdminManageUserUseCase } from '../../application/use-cases/admin-manage-user.use-case';
import { AdminStatsUseCase } from '../../application/use-cases/admin-stats.use-case';
import { UserModule } from './user.module'; 
import { PropertyModule } from './property.module'; 

@Module({
  imports: [UserModule, PropertyModule], 
  controllers: [AdminController],
  providers: [AdminManageUserUseCase, AdminStatsUseCase],
})
export class AdminModule {}
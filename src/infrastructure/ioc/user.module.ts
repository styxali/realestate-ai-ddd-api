import { Module } from '@nestjs/common';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { PrismaUserRepository } from '../persistence/repositories/prisma-user.repository';
import { BcryptService } from '../adapters/bcrypt.service';
import { UserController } from '../controllers/user.controller';
// We export this module so the main app can use it
@Module({
controllers: [UserController],
  imports: [], 
  providers: [
    CreateUserUseCase,
    // Dependency Injection wiring:
    {
      provide: 'IUserRepository',
      useClass: PrismaUserRepository,
    },
    {
      provide: 'IPasswordService',
      useClass: BcryptService,
    },
    // We need to register the Repo itself if it relies on Prisma (simplified here)
    PrismaUserRepository, 
  ],
  exports: [CreateUserUseCase,'IUserRepository', 'IPasswordService'], // Export UseCase so Controllers can use it
})
export class UserModule {}
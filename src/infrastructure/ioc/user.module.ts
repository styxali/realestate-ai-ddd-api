import { Module } from '@nestjs/common';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { PrismaUserRepository } from '../persistence/repositories/prisma-user.repository';
import { BcryptService } from '../adapters/bcrypt.service';
import { UserController } from '../controllers/user.controller';
@Module({
controllers: [UserController],
  imports: [], 
  providers: [
    CreateUserUseCase,
    {
      provide: 'IUserRepository',
      useClass: PrismaUserRepository,
    },
    {
      provide: 'IPasswordService',
      useClass: BcryptService,
    },
    PrismaUserRepository, 
  ],
  exports: [CreateUserUseCase,'IUserRepository', 'IPasswordService'], 
})
export class UserModule {}
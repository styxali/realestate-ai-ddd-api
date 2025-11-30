import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from './user.module';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case';
import { AuthController } from '../controllers/auth.controller';
import { JwtTokenService } from '../adapters/jwt.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import { RefreshTokenUseCase } from 'src/application/use-cases/refresh-token.use-case';
import { PrismaRefreshTokenRepository } from '../persistence/repositories/prisma-refresh-token.repository';

@Module({
  imports: [
    UserModule, // Gives access to User Repo/Password Service
    PassportModule,
    JwtModule.register({
      secret: 'SUPER_SECRET_KEY_CHANGE_IN_PROD', // use process.env.JWT_SECRET
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    LoginUserUseCase,
    RefreshTokenUseCase,
    {
      provide: 'IRefreshTokenRepository',
      useClass: PrismaRefreshTokenRepository,
    },
    JwtStrategy,
    {
      provide: 'ITokenService',
      useClass: JwtTokenService,
    },
  ],
})
export class AuthModule {}
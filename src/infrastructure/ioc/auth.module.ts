import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from './user.module';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case';
import { AuthController } from '../controllers/auth.controller';
import { JwtTokenService } from '../adapters/jwt.service';
import { JwtStrategy } from '../auth/jwt.strategy';

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
    JwtStrategy,
    {
      provide: 'ITokenService',
      useClass: JwtTokenService,
    },
  ],
})
export class AuthModule {}
import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case';
import { RefreshTokenUseCase } from 'src/application/use-cases/refresh-token.use-case';

@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUserUseCase, 
    private readonly refreshUseCase: RefreshTokenUseCase) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: any) {
    return this.loginUseCase.execute({ email: body.email, password: body.password });
  }

   @Post('refresh')
  async refresh(@Body() body: { userId: string, refreshToken: string }) {
    return this.refreshUseCase.execute(body.userId, body.refreshToken);
  }
}
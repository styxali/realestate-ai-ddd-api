import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case';

@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUserUseCase) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: any) {
    return this.loginUseCase.execute({ email: body.email, password: body.password });
  }
}
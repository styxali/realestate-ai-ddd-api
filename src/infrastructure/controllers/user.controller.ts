import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { CreateUserRequest } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() request: CreateUserRequest) {
    const user = await this.createUserUseCase.execute({
      email: request.email,
      password: request.password,
      role: request.role,
    });

    // Transform Domain Entity to Response (Don't leak password hash!)
    return {
      id: user.getId(),
      email: user.getEmail(),
      role: user.getRole(),
      createdAt: user.getIsActive(), // Just an example field
    };
  }
}
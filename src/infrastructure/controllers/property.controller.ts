import { Body, Controller, Post, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; // <--- Import
import { CreatePropertyUseCase } from '../../application/use-cases/create-property.use-case';
import { CreatePropertyRequest } from './dto/create-property.dto';

@Controller('properties')
export class PropertyController {
  constructor(private readonly createPropertyUseCase: CreatePropertyUseCase) {}

  @Post()
  @UseGuards(AuthGuard('jwt')) // <--- Protect this route
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() request: CreatePropertyRequest, @Request() req: any) {
    // req.user comes from JwtStrategy.validate()
    const user = req.user; 

    const property = await this.createPropertyUseCase.execute({
      ownerId: user.id, // <--- Automatically set from Token
      title: request.title,
      description: request.description,
      price: request.price,
    });

    return {
      status: 'success',
      data: { id: property.getId() },
    };
  }
}
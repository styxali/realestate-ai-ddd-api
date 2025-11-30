import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { CreatePropertyUseCase } from '../../application/use-cases/create-property.use-case';
import { CreatePropertyRequest } from './dto/create-property.dto';

@Controller('properties')
export class PropertyController {
  constructor(private readonly createPropertyUseCase: CreatePropertyUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() request: CreatePropertyRequest) {
    const property = await this.createPropertyUseCase.execute({
      ownerId: request.ownerId,
      title: request.title,
      description: request.description,
      price: request.price,
    });

    // Return a clean response
    return {
      status: 'success',
      data: {
        id: property.getId(),
        title: property.getTitle(),
        status: 'created',
        note: 'AI processing started in background',
      },
    };
  }
}
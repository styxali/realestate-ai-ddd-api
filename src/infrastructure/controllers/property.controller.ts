import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard'; 
import { Roles } from '../auth/roles.decorator'; 
import { UserRole } from '../../domain/model/user'; 
import { CreatePropertyUseCase } from '../../application/use-cases/create-property.use-case';
import { CreatePropertyRequest } from './dto/create-property.dto';
import { ListPropertiesUseCase } from '../../application/use-cases/list-properties.use-case';
@Controller('properties')
export class PropertyController {
  constructor(
    private readonly createPropertyUseCase: CreatePropertyUseCase,
    private readonly listPropertiesUseCase: ListPropertiesUseCase,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard) 
  @Roles(UserRole.OWNER) 
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() request: CreatePropertyRequest, @Request() req: any) {
    const user = req.user;

    const property = await this.createPropertyUseCase.execute({
      ownerId: user.id,
      title: request.title,
      description: request.description,
      price: request.price,
    });

    return {
      status: 'success',
      data: { id: property.getId() },
    };
  }
  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER, UserRole.AGENT) // Users cannot see this list, only staff
  async list(@Request() req: any) {
    const user = req.user;
    
    // The logic is delegated to the UseCase
    const properties = await this.listPropertiesUseCase.execute({
      id: user.id,
      role: user.role,
      managerId: user.managerId,
    });

    return {
      status: 'success',
      count: properties.length,
      data: properties.map(p => ({
        id: p.getId(),
        title: p.getTitle(),
        description: p.getDescription(),
        price: p.getPrice(),
        // We could also return ownerId to verify on frontend
      })),
    };
  }
}

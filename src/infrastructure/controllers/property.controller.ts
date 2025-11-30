import { 
  Body, Controller, Post, HttpCode, HttpStatus, 
  UseGuards, Request 
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard'; // <--- Import
import { Roles } from '../auth/roles.decorator'; // <--- Import
import { UserRole } from '../../domain/model/user'; // <--- Import
import { CreatePropertyUseCase } from '../../application/use-cases/create-property.use-case';
import { CreatePropertyRequest } from './dto/create-property.dto';

@Controller('properties')
export class PropertyController {
  constructor(private readonly createPropertyUseCase: CreatePropertyUseCase) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard) // <--- Stack Guards (Auth first, then Roles)
  @Roles(UserRole.OWNER) // <--- Only Owners (and Admins) allowed
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
}
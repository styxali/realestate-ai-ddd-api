import { Module } from '@nestjs/common';
import { CreatePropertyUseCase } from '../../application/use-cases/create-property.use-case';
import { PrismaPropertyRepository } from '../persistence/repositories/prisma-property.repository';
import { PropertyCreatedListener } from '../../application/listeners/property-created.listener';
import { MockAIService } from '../adapters/mock-ai.service';
import { MockVectorStore } from '../adapters/mock-vector-store';
import { PropertyController } from '../controllers/property.controller';
import { ListPropertiesUseCase } from '../../application/use-cases/list-properties.use-case';
@Module({
  controllers: [PropertyController],
  providers: [
    CreatePropertyUseCase,
    PropertyCreatedListener,
    ListPropertiesUseCase,
    {
      provide: 'IPropertyRepository',
      useClass: PrismaPropertyRepository,
    },
    {
      provide: 'IAIService',
      useClass: MockAIService, // We will swap this later!
    },
    {
      provide: 'IVectorStore',
      useClass: MockVectorStore, // We will swap this later!
    },
    PrismaPropertyRepository,
  ],
  exports: [
    CreatePropertyUseCase, 
    ListPropertiesUseCase,
    'IAIService', 
    'IVectorStore'
],
})
export class PropertyModule {}

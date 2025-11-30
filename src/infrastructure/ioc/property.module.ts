import { Module } from '@nestjs/common';
import { CreatePropertyUseCase } from '../../application/use-cases/create-property.use-case';
import { PrismaPropertyRepository } from '../persistence/repositories/prisma-property.repository';
import { PropertyCreatedListener } from '../../application/listeners/property-created.listener';
import { MockAIService } from '../adapters/mock-ai.service';
import { MockVectorStore } from '../adapters/mock-vector-store';

@Module({
  providers: [
    CreatePropertyUseCase,
    PropertyCreatedListener,
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
  exports: [CreatePropertyUseCase],
})
export class PropertyModule {}
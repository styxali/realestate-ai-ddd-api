import { Module } from '@nestjs/common';
import { CreatePropertyUseCase } from '../../application/use-cases/create-property.use-case';
import { PrismaPropertyRepository } from '../persistence/repositories/prisma-property.repository';
import { PropertyCreatedListener } from '../../application/listeners/property-created.listener';
import { MockAIService } from '../adapters/mock-ai.service';
import { MockVectorStore } from '../adapters/mock-vector-store';
import { PropertyController } from '../controllers/property.controller';
import { ListPropertiesUseCase } from '../../application/use-cases/list-properties.use-case';
import { OpenAIService } from '../adapters/openai.service';
import { GeminiService } from '../adapters/gemini.service';

const AIProviderFactory = {
  provide: 'IAIService',
  useFactory: () => {
    const provider = process.env.AI_PROVIDER;
    
    if (provider === 'gemini') {
      console.log('Using Gemini AI Provider');
      return new GeminiService();
    } 
    
    if (provider === 'openai' || provider === 'deepseek') {
      console.log(`Using ${provider === 'deepseek' ? 'DeepSeek' : 'OpenAI'} Provider`);
      return new OpenAIService(); // Internally handles logic
    }

    console.warn('No valid AI_PROVIDER set, using Mock');
    return new MockAIService();
  },
};
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
    AIProviderFactory,
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

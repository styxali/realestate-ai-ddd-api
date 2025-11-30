import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { CreatePropertyUseCase } from '../../application/use-cases/create-property.use-case';
import { PrismaPropertyRepository } from '../persistence/repositories/prisma-property.repository';
import { PropertyCreatedListener } from '../../application/listeners/property-created.listener';
import { MockAIService } from '../adapters/mock-ai.service';
import { MockVectorStore } from '../adapters/mock-vector-store';
import { PropertyController } from '../controllers/property.controller';
import { ListPropertiesUseCase } from '../../application/use-cases/list-properties.use-case';
import { OpenAIService } from '../adapters/openai.service';
import { GeminiService } from '../adapters/gemini.service';
import { PrismaVectorStore } from '../persistence/repositories/prisma-vector-store';
import { EmbeddingProcessor } from '../../application/jobs/embedding.processor'; 
const VectorStoreFactory = {
  provide: 'IVectorStore',
  useFactory: () => {
    const dbUrl = process.env.DATABASE_URL || '';
    
    // Simple heuristic: If URL contains 'postgres', assumes we have vector support
    if (dbUrl.includes('postgres') || dbUrl.includes('neon')) {
      console.log('Using Real PgVector Store');
      return new PrismaVectorStore();
    }
    
    console.warn('Using Mock Vector Store (SQLite detected)');
    return new MockVectorStore();
  },
};
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
    imports: [
    BullModule.registerQueue({
      name: 'embedding-queue',
    }),
  ],
  controllers: [PropertyController],
  providers: [
    CreatePropertyUseCase,
    PropertyCreatedListener,
    ListPropertiesUseCase,
    EmbeddingProcessor,
    {
      provide: 'IPropertyRepository',
      useClass: PrismaPropertyRepository,
    },
    AIProviderFactory,
    VectorStoreFactory,
    PrismaPropertyRepository,
  ],
  exports: [
    CreatePropertyUseCase, 
    ListPropertiesUseCase,
    'IAIService', 
    'IVectorStore',
    'IPropertyRepository',
    BullModule,
],
})
export class PropertyModule {}

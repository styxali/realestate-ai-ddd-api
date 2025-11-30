import { Module } from '@nestjs/common';
import { AIController } from '../controllers/ai.controller';
import { ChatPropertyUseCase } from '../../application/use-cases/chat-property.use-case';
import { PropertyModule } from './property.module'; // Import to get the Services

@Module({
  imports: [PropertyModule], 
  controllers: [AIController],
  providers: [ChatPropertyUseCase],
})
export class AIModule {}
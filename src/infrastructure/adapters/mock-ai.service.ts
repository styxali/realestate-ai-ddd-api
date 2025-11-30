import { Injectable, Logger } from '@nestjs/common';
import { IAIService } from '../../application/ports/ai.service.interface';

@Injectable()
export class MockAIService implements IAIService {
  private readonly logger = new Logger(MockAIService.name);

  async generateEmbedding(text: string): Promise<number[]> {
    this.logger.warn('Mock AI used: Generating random vector');
    // Return a fake 1536-dimensional vector (standard OpenAI size)
    return Array(1536).fill(0).map(() => Math.random());
  }
}
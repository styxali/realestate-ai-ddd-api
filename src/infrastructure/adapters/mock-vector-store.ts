import { Injectable, Logger } from '@nestjs/common';
import { IVectorStore } from '../../application/ports/vector-store.interface';

@Injectable()
export class MockVectorStore implements IVectorStore {
  private readonly logger = new Logger(MockVectorStore.name);

  async savePropertyVector(id: string, vector: number[], content: string): Promise<void> {
    this.logger.warn(`Mock DB used: Pretending to save vector for Property ${id}`);
    // Here we would normally insert into 'embeddings' table
  }
}
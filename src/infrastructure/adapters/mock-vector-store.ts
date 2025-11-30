import { Injectable, Logger } from '@nestjs/common';
import { IVectorStore } from '../../application/ports/vector-store.interface';
import { VectorSearchResult } from '../../application/ports/vector-store.interface';
@Injectable()
export class MockVectorStore implements IVectorStore {
  private readonly logger = new Logger(MockVectorStore.name);

  async savePropertyVector(id: string, vector: number[], content: string): Promise<void> {
    this.logger.warn(`Mock DB used: Pretending to save vector for Property ${id}`);
    // Here we would normally insert into 'embeddings' table
  }
  async search(queryVector: number[], limit: number): Promise<VectorSearchResult[]> {
    this.logger.warn('Mock DB: Returning fake search results');
    
    // Return dummy data so the UI/Frontend has something to show
    return [
      {
        propertyId: 'mock-id-1',
        score: 0.9,
        content: 'Title: Luxury Villa in Miami. Description: A beautiful 5 bedroom villa...',
      },
      {
        propertyId: 'mock-id-2',
        score: 0.85,
        content: 'Title: Miami Beach Condo. Description: Modern 2 bedroom flat...',
      }
    ];
  }
}
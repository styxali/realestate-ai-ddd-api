import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { IVectorStore, VectorSearchResult } from '../../../../application/ports/vector-store.interface';

@Injectable()
export class PrismaVectorStore implements IVectorStore {
  private readonly logger = new Logger(PrismaVectorStore.name);
  private prisma = new PrismaClient();

  async savePropertyVector(propertyId: string, vector: number[], content: string): Promise<void> {
    // 1. Format vector as string for SQL: '[0.1, 0.2, ...]'
    const vectorString = `[${vector.join(',')}]`;

    // 2. Execute Raw SQL Insert/Upsert
    // We use ::vector to cast the string to the postgres vector type
    await this.prisma.$executeRaw`
      INSERT INTO property_embeddings (id, "propertyId", content, vector)
      VALUES (gen_random_uuid(), ${propertyId}, ${content}, ${vectorString}::vector)
      ON CONFLICT ("propertyId") 
      DO UPDATE SET vector = ${vectorString}::vector, content = ${content};
    `;
    
    this.logger.log(`Saved vector for property ${propertyId}`);
  }

  async search(queryVector: number[], limit: number): Promise<VectorSearchResult[]> {
    const vectorString = `[${queryVector.join(',')}]`;

    // 3. Execute Cosine Similarity Search (<=> operator)
    // "1 - (vector <=> query)" gives cosine similarity (where 1 is identical)
    // But usually ordering by "vector <=> query" (Distance) ASC is enough.
    // Distance 0 = Identical.
    
    const results = await this.prisma.$queryRaw<any[]>`
      SELECT 
        "propertyId", 
        content, 
        1 - (vector <=> ${vectorString}::vector) as score
      FROM property_embeddings
      ORDER BY vector <=> ${vectorString}::vector ASC
      LIMIT ${limit};
    `;

    // Map raw result to Domain Interface
    return results.map((row: any) => ({
      propertyId: row.propertyId,
      score: row.score,
      content: row.content,
    }));
  }
}
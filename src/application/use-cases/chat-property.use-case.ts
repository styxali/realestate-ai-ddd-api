import { Inject, Injectable } from '@nestjs/common';
import { IAIService } from '../ports/ai.service.interface';
import { IVectorStore } from '../ports/vector-store.interface';

@Injectable()
export class ChatPropertyUseCase {
  constructor(
    @Inject('IAIService') private readonly aiService: IAIService,
    @Inject('IVectorStore') private readonly vectorStore: IVectorStore,
  ) {}

  async execute(userQuery: string): Promise<string> {
    // 1. Convert User Query to Vector
    const queryVector = await this.aiService.generateEmbedding(userQuery);

    // 2. Retrieve Relevant Documents (RAG)
    const similarDocs = await this.vectorStore.search(queryVector, 3);

    // 3. Construct Prompt with Context
    const context = similarDocs.map(doc => `- ${doc.content}`).join('\n');
    
    const prompt = `
      You are a helpful Real Estate Assistant.
      Use the following property listings to answer the user's question.
      If the answer is not in the listings, say you don't know.

      Listings:
      ${context}

      User Question: "${userQuery}"
      Answer:
    `;

    // 4. Ask LLM
    const response = await this.aiService.generateCompletion(prompt);

    return response;
  }
}
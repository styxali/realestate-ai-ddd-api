import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { IAIService } from '../../application/ports/ai.service.interface';

@Injectable()
export class OpenAIService implements IAIService {
  private readonly logger = new Logger(OpenAIService.name);
  private client: OpenAI;
  private model: string;

  constructor() {
    const provider = process.env.AI_PROVIDER || 'openai';
    
    if (provider === 'deepseek') {
      this.client = new OpenAI({
        baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
        apiKey: process.env.DEEPSEEK_API_KEY,
      });
      this.model = 'deepseek-chat'; // Or 'deepseek-r1'
    } else {
      this.client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      this.model = 'gpt-4o-mini'; // Cost-effective default
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      // DeepSeek might not support embeddings via the same endpoint yet, 
      // or allows standard OpenAI embedding models. 
      // Fallback: If using DeepSeek for Chat, we might still use OpenAI for Embeddings 
      // OR use a specific local embedding model. 
      // For this example, assuming OpenAI embeddings are used for simplicity even if Chat is DeepSeek.
      
      const response = await this.client.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
      });
      return response.data[0].embedding;
    } catch (error) {
      this.logger.error('Embedding Error', error);
      throw error;
    }
  }

  async generateCompletion(prompt: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [{ role: 'user', content: prompt }],
    });
    return response.choices[0].message.content || '';
  }
}
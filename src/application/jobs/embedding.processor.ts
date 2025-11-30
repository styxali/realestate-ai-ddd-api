import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Inject, Logger } from '@nestjs/common';
import { IAIService } from '../ports/ai.service.interface';
import { IVectorStore } from '../ports/vector-store.interface';

// Define the Job Data Structure
export interface EmbeddingJobData {
  propertyId: string;
  title: string;
  description: string;
}

@Processor('embedding-queue') // The name of the queue
export class EmbeddingProcessor extends WorkerHost {
  private readonly logger = new Logger(EmbeddingProcessor.name);

  constructor(
    @Inject('IAIService') private readonly aiService: IAIService,
    @Inject('IVectorStore') private readonly vectorStore: IVectorStore,
  ) {
    super();
  }

  async process(job: Job<EmbeddingJobData>): Promise<any> {
    this.logger.log(`[Job ${job.id}] Processing embedding for Property: ${job.data.propertyId}`);

    try {
      // 1. Prepare Text
      const textToEmbed = `Title: ${job.data.title}. Description: ${job.data.description}`;

      // 2. Generate Vector
      const vector = await this.aiService.generateEmbedding(textToEmbed);

      // 3. Save to Vector DB
      await this.vectorStore.savePropertyVector(job.data.propertyId, vector, textToEmbed);

      this.logger.log(`[Job ${job.id}] Completed successfully.`);
    } catch (error) {
      this.logger.error(`[Job ${job.id}] Failed. BullMQ will retry if configured.`, error);
      throw error; // Throwing triggers the retry mechanism
    }
  }
}
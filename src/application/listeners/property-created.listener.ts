import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PropertyCreatedEvent } from '../../domain/events/property-created.event';
import { IAIService } from '../ports/ai.service.interface';
import { IVectorStore } from '../ports/vector-store.interface';

@Injectable()
export class PropertyCreatedListener {
  private readonly logger = new Logger(PropertyCreatedListener.name);

  constructor(
    @Inject('IAIService') private readonly aiService: IAIService,
    @Inject('IVectorStore') private readonly vectorStore: IVectorStore,
  ) {}

  @OnEvent('property.created', { async: true })
  async handlePropertyCreatedEvent(event: PropertyCreatedEvent) {
    this.logger.log(`Processing embedding for property: ${event.propertyId}`);

    try {
      // 1. Prepare text for embedding (Combine title + desc)
      const textToEmbed = `Title: ${event.title}. Description: ${event.description}`;

      // 2. Generate Vector (Calls OpenAI or Mock)
      const vector = await this.aiService.generateEmbedding(textToEmbed);

      // 3. Save to Vector DB
      await this.vectorStore.savePropertyVector(event.propertyId, vector, textToEmbed);

      this.logger.log(`Successfully indexed property ${event.propertyId} for RAG.`);
    } catch (error) {
      this.logger.error(`Failed to generate embedding for property ${event.propertyId}`, error);
      // In a real app, you might want to add a retry mechanism or Dead Letter Queue here
    }
  }
}
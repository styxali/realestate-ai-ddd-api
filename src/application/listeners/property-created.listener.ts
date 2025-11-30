import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PropertyCreatedEvent } from '../../domain/events/property-created.event';
import { EmbeddingJobData } from '../jobs/embedding.processor';

@Injectable()
export class PropertyCreatedListener {
  private readonly logger = new Logger(PropertyCreatedListener.name);

  constructor(
    @InjectQueue('embedding-queue') private readonly embeddingQueue: Queue,
  ) {}

  @OnEvent('property.created')
  async handlePropertyCreatedEvent(event: PropertyCreatedEvent) {
    this.logger.log(`Event received. Dispatching Job to Queue for property: ${event.propertyId}`);

    // Add job to Redis
    await this.embeddingQueue.add('generate-embedding', {
      propertyId: event.propertyId,
      title: event.title,
      description: event.description,
    } as EmbeddingJobData, {
      attempts: 3, // Retry 3 times on failure
      backoff: 5000, // Wait 5 seconds between retries
      removeOnComplete: true, // Don't clog Redis with success logs
    });
  }
}
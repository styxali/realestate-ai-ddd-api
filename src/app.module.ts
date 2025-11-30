import { Module } from '@nestjs/common';
import {BullModule } from '@nestjs/bullmq';
import { UserModule } from './infrastructure/ioc/user.module';
import { PropertyModule } from './infrastructure/ioc/property.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule } from './infrastructure/ioc/auth.module';
import { TeamModule } from './infrastructure/ioc/team.module';
import { AIModule } from './infrastructure/ioc/ai.module';
import { AdminModule } from './infrastructure/ioc/admin.module';
@Module({
  imports: [
    EventEmitterModule.forRoot(),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
      },
    }),
    AuthModule,
    AdminModule,
    UserModule,
    PropertyModule,
    TeamModule,
    AIModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

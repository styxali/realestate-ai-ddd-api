import { Module } from '@nestjs/common';
import { UserModule } from './infrastructure/ioc/user.module';
import { PropertyModule } from './infrastructure/ioc/property.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule } from './infrastructure/ioc/auth.module';
import { TeamModule } from './infrastructure/ioc/team.module';
import { AIModule } from './infrastructure/ioc/ai.module';
@Module({
  imports: [
    EventEmitterModule.forRoot(),
    AuthModule,
    UserModule,
    PropertyModule,
    TeamModule,
    AIModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

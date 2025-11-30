import { Module } from '@nestjs/common';
import { UserModule } from './infrastructure/ioc/user.module';
import { PropertyModule } from './infrastructure/ioc/property.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
@Module({
  imports: [EventEmitterModule.forRoot(), UserModule, PropertyModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
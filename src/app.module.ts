import { Module } from '@nestjs/common';
import { UserModule } from './infrastructure/ioc/user.module';
import { PropertyModule } from './infrastructure/ioc/property.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule } from './infrastructure/ioc/auth.module';
import { TeamModule } from './infrastructure/ioc/team.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    AuthModule,
    UserModule,
    PropertyModule,
    TeamModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

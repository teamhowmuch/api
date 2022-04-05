import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EmissionEvent } from 'src/entities/EmissionEvent'
import { EmissionEventsController } from './emission-events.controller'
import { EmissionEventsService } from './emission-events.service'

@Module({
  imports: [TypeOrmModule.forFeature([EmissionEvent])],
  controllers: [EmissionEventsController],
  providers: [EmissionEventsService],
  exports: [EmissionEventsService],
})
export class EmissionEventsModule {}

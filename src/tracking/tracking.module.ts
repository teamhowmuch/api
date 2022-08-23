import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TrackingEvent } from 'src/entities/TrackingEvent'
import { TrackingSession } from 'src/entities/TrackingSession'
import { UsersModule } from 'src/users/users.module'
import { TrackingController } from './tracking.controller'
import { TrackingService } from './tracking.service'

@Module({
  imports: [TypeOrmModule.forFeature([TrackingEvent, TrackingSession]), UsersModule],
  controllers: [TrackingController],
  providers: [TrackingService],
})
export class TrackingModule {}

import { TrackingEvent } from 'src/entities/TrackingEvent'
import { IsObject, IsOptional, IsString } from 'class-validator'

export class CreateTrackingEventDto {
  @IsString() source: TrackingEvent['source']
  @IsString() action: TrackingEvent['action']
  @IsString() @IsOptional() url: TrackingEvent['action']
  @IsString() @IsOptional() page_title: TrackingEvent['action']
  @IsString() @IsOptional() environment: TrackingEvent['environment']
  @IsString() @IsOptional() category: TrackingEvent['category']
  @IsObject() @IsOptional() data: TrackingEvent['data']
}

import { IsNumber, IsOptional, IsString } from 'class-validator'
import { TrackingSession } from 'src/entities/TrackingSession'
import { User } from 'src/entities/User'

export class AssociateTrackingSessionDto {
  @IsNumber() @IsOptional() user_id: TrackingSession['user_id']
  @IsString() @IsOptional() user_email: User['email']
}

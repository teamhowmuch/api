import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TrackingEvent } from 'src/entities/TrackingEvent'
import { TrackingSession } from 'src/entities/TrackingSession'
import { UsersService } from 'src/users/users.service'
import { Repository } from 'typeorm'
import { CreateTrackingEventDto } from './CreateTrackingEventDto'
import { AssociateTrackingSessionDto } from './AssociateTrackingSessionDto'

@Injectable()
export class TrackingService {
  constructor(
    @InjectRepository(TrackingEvent) private trackingEventRepo: Repository<TrackingEvent>,
    @InjectRepository(TrackingSession) private trackingSessionRepo: Repository<TrackingSession>,
    private usersService: UsersService,
  ) {}

  async createSession() {
    const trackingSession = new TrackingSession()
    return this.trackingSessionRepo.save(trackingSession)
  }

  async associateSession(
    sessionId: TrackingSession['id'],
    { user_id, user_email }: AssociateTrackingSessionDto,
  ) {
    const trackingSession = await this.findSessionById(sessionId)

    if (!trackingSession) {
      throw new NotFoundException('No session with that id')
    }

    console.log('Associating session', sessionId, user_email)

    if (user_id) {
      trackingSession.user_id = user_id
    } else if (user_email) {
      const user = await this.usersService.findOne({ where: { email: user_email } })
      if (user) {
        trackingSession.user_id = user.id
      }
    }

    return
  }

  async findSessionById(id: TrackingSession['id']) {
    return this.trackingSessionRepo.findOne({ where: { id } })
  }

  async createEvent(
    trackingSessionId: TrackingEvent['tracking_session_id'],
    dto: CreateTrackingEventDto,
  ) {
    const trackingSession = await this.findSessionById(trackingSessionId)

    if (!trackingSession) {
      throw new BadRequestException('No session with that id exists')
    }

    const trackingEvent = new TrackingEvent()
    trackingEvent.tracking_session_id = trackingSessionId
    trackingEvent.user_id = trackingSession.user_id
    trackingEvent.action = dto.action
    trackingEvent.page_title = dto.page_title
    trackingEvent.url = dto.url
    trackingEvent.category = dto.category
    trackingEvent.data = dto.data
    trackingEvent.source = dto.source

    console.log('Logging event', trackingEvent)

    return this.trackingEventRepo.save(trackingEvent)
  }

  async listEvents() {
    return this.trackingEventRepo.find({ take: 100 })
  }

  async listSessions() {
    return this.trackingSessionRepo.find({ take: 100, relations: ['tracking_events'] })
  }
}

import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { Roles } from 'src/auth/roles.decorator'
import { RolesGuard } from 'src/auth/roles.guard'
import { RoleEnum } from 'src/entities/UserRole'
import { CreateTrackingEventDto } from './CreateTrackingEventDto'
import { AssociateTrackingSessionDto } from './AssociateTrackingSessionDto'
import { TrackingService } from './tracking.service'

const COOKIE_KEY = 'gt'

@Controller('tracking')
export class TrackingController {
  constructor(private trackingService: TrackingService) {}

  @Post('/associate')
  async createSession(@Req() req: Request, @Body() body: AssociateTrackingSessionDto) {
    if (req.cookies && req.cookies[COOKIE_KEY]) {
      const sessionId = req.cookies[COOKIE_KEY]
      return this.trackingService.associateSession(sessionId, body)
    } else {
      throw new BadRequestException('No gt cookie present')
    }
  }

  @Post('/events')
  async createEvent(
    @Req() req: Request,
    @Body() body: CreateTrackingEventDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    let sessionId: string
    if (req.cookies && req.cookies[COOKIE_KEY]) {
      sessionId = req.cookies[COOKIE_KEY]
    } else {
      const newSession = await this.trackingService.createSession()
      sessionId = newSession.id
    }
    response.cookie(COOKIE_KEY, sessionId, { maxAge: 30 * 1000 * 60 })
    return this.trackingService.createEvent(sessionId, body)
  }

  @Get('events')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  listEvents() {
    return this.trackingService.listEvents()
  }

  @Get('sessions')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  listSessions() {
    return this.trackingService.listSessions()
  }
}

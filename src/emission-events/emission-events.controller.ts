import { Controller, Delete, Get, Param, ParseIntPipe, Put, Req, UseGuards } from '@nestjs/common'
import { AuthenticatedRequest, JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { verifyAccess } from 'src/auth/verifyAccess'
import { EmissionEventsService } from './emission-events.service'

@Controller('users/:userId/emission-events')
export class EmissionEventsController {
  constructor(private emissionEventsService: EmissionEventsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async list(@Req() req: AuthenticatedRequest, @Param('userId', ParseIntPipe) userId: number) {
    verifyAccess(req.user, userId)
    return this.emissionEventsService.find(userId)
  }

  @UseGuards(JwtAuthGuard)
  @Get(':eventId')
  async getOne(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) eventId: number,
    @Req() req: AuthenticatedRequest,
  ) {
    verifyAccess(req.user, userId)
    return this.emissionEventsService.findOne({ where: { id: eventId, user_id: userId } })
  }

  @UseGuards(JwtAuthGuard)
  @Put(':eventId')
  async softDeleteOne(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) eventId: number,
    @Req() req: AuthenticatedRequest,
  ) {
    verifyAccess(req.user, userId)
    return this.emissionEventsService.softDeleteOne(eventId)
  }
}

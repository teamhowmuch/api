import { Controller, Get, Param, ParseIntPipe, Req, UseGuards } from '@nestjs/common'
import { AuthenticatedRequest, JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { EmissionEventsService } from './emission-events.service'

@Controller('emission-events')
export class EmissionEventsController {
  constructor(private emissionEventsService: EmissionEventsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async list(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id
    return this.emissionEventsService.find(userId)
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) eventId: number, @Req() req: AuthenticatedRequest) {
    const userId = req.user.id
    return this.emissionEventsService.findOne({ where: { id: eventId, user_id: userId } })
  }
}

import { Controller, Delete, Get, Param, ParseIntPipe, Req, UseGuards, Query } from '@nestjs/common'
import { AuthenticatedRequest, JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { verifyAccess } from 'src/auth/verifyAccess'
import { EmissionEvent } from 'src/entities/EmissionEvent'
import { SearchInput } from 'src/search/searchInput'
import { SearchResults } from 'src/search/searchResults'
import { EmissionEventsService } from './emission-events.service'

@Controller('users/:userId/emission-events')
export class EmissionEventsController {
  constructor(private emissionEventsService: EmissionEventsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async list(
    @Req() req: AuthenticatedRequest,
    @Query() query: SearchInput,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<SearchResults<EmissionEvent>> {
    verifyAccess(req.user, userId)

    const searchInput: SearchInput = {
      limit: query.limit,
      offset: query.offset,
      orderByDirection: query.orderByDirection,
      orderByField: query.orderByField,
    }

    return this.emissionEventsService.list(searchInput, userId)
  }

  @UseGuards(JwtAuthGuard)
  @Get(':eventId')
  async getOne(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('eventId', ParseIntPipe) eventId: number,
    @Req() req: AuthenticatedRequest,
  ) {
    verifyAccess(req.user, userId)
    return this.emissionEventsService.findOne({ where: { id: eventId, user_id: userId } })
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':eventId')
  async softDeleteOne(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('eventId', ParseIntPipe) eventId: number,
    @Req() req: AuthenticatedRequest,
  ) {
    verifyAccess(req.user, userId)
    return this.emissionEventsService.softDeleteOne(eventId)
  }
}

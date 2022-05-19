import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common'
import { AuthenticatedRequest, JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { verifyAccess } from 'src/auth/verifyAccess'
import { FlightsService } from './flights.service'
import { CreateFlightDto } from './models'

@Controller('users/:userId/flights')
export class UsersFlightsController {
  constructor(private flightsService: FlightsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async list(@Req() { user }: AuthenticatedRequest, @Param('userId', ParseIntPipe) userId: number) {
    verifyAccess(user, userId)
    return this.flightsService.find({ where: { user_id: userId } })
  }

  @UseGuards(JwtAuthGuard)
  @Get(':flightId')
  async getOne(
    @Req() { user }: AuthenticatedRequest,
    @Param('userId', ParseIntPipe) userId: number,
    @Param('flightId', ParseIntPipe) flightId: number,
  ) {
    verifyAccess(user, userId)
    return this.flightsService.findOne({ where: { user_id: userId, id: flightId } })
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() dto: CreateFlightDto,
    @Req() { user }: AuthenticatedRequest,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    verifyAccess(user, userId)
    return this.flightsService.create(userId, dto)
  }
}

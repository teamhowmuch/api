import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { AirportsService } from './airports.service'

@Controller('airports')
export class AirportsController {
  constructor(private airportsService: AirportsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  searchByName(@Query('name') name: string) {
    return this.airportsService.findByName(name)
  }

  @UseGuards(JwtAuthGuard)
  @Get(':iata_id')
  find(@Param('iata_id') iataId: string) {
    return this.airportsService.findOne(iataId)
  }

  @UseGuards(JwtAuthGuard)
  @Post('import')
  async importAirports() {
    await this.airportsService.updateAirports()
    return true
  }
}

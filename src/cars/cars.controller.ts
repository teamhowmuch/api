import { Controller, Get, Query, UseGuards } from '@nestjs/common'

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { CarsService } from './cars.service'

@Controller('cars')
export class CarsController {
  constructor(private carsService: CarsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  get(@Query('license_plate') license_plate: string) {
    console.log(license_plate)
    return this.carsService.lookup(license_plate)
  }
}

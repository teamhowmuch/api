import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common'
import { IsString } from 'class-validator'
import { AuthenticatedRequest, JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { CarsService } from './cars.service'

class CreateCarDto {
  @IsString()
  license_plate: string
}

@Controller('cars')
export class CarsController {
  constructor(private carsService: CarsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('lookup')
  get(@Query('license_plate') license_plate: string) {
    console.log(license_plate)
    return this.carsService.lookup(license_plate)
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: CreateCarDto, @Request() req: AuthenticatedRequest) {
    return this.carsService.create(req.user.id, body.license_plate)
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  list(@Request() req: AuthenticatedRequest) {
    return this.carsService.list(req.user.id)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Request() req: AuthenticatedRequest, @Param('id', ParseIntPipe) id: number) {
    return this.carsService.delete(req.user.id, id)
  }
}

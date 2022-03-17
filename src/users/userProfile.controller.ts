import { Body, Controller, Get, Patch, Post, Request, UseGuards } from '@nestjs/common'

import { UsersService } from './users.service'
import { AuthenticatedRequest, JwtAuthGuard } from '../auth/jwt-auth.guard'
import { FuelType } from 'src/products/carfuel/carfuel.service'
import { IsEnum, IsOptional } from 'class-validator'

class PatchProfileDto {
  @IsOptional()
  @IsEnum(FuelType)
  car_fuel_type?: FuelType
}


@Controller('profile')
export class UserProfileController {
  constructor(private userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  get(@Request() req: AuthenticatedRequest) {
    const { user } = req
    return this.userService.findOne({ id: user.id })
  }

  @UseGuards(JwtAuthGuard)
  @Patch('')
  patch(@Request() req: AuthenticatedRequest, @Body() dto: PatchProfileDto) {
    const { user } = req
    console.log('xx',dto)
    return this.userService.update(user.id, dto)
  }
}

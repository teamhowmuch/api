import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common'
import { IsString } from 'class-validator'
import { AuthenticatedRequest, JwtAuthGuard, UserPayload } from 'src/auth/jwt-auth.guard'
import { RoleEnum } from 'src/entities/UserRole'
import { CarsService } from './cars.service'

class CreateCarDto {
  @IsString()
  license_plate: string
}

export function verifyAccess(
  user: UserPayload,
  requestUserId: number,
  requiredRoles: RoleEnum[] = [RoleEnum.ADMIN],
) {
  if (requiredRoles.every((role) => user.roles.includes(role))) {
    return true
  } else if (user.id === requestUserId) {
    return true
  } else {
    throw new ForbiddenException()
  }
}

@Controller('/users/:userId/cars')
export class UsersCarsController {
  constructor(private carsService: CarsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: CreateCarDto,
    @Request() req: AuthenticatedRequest,
  ) {
    verifyAccess(req.user, userId)
    return this.carsService.create(userId, body.license_plate)
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  list(@Param('userId', ParseIntPipe) userId: number, @Request() req: AuthenticatedRequest) {
    verifyAccess(req.user, userId)
    return this.carsService.list(userId)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:carId')
  delete(
    @Param('userId', ParseIntPipe) userId: number,
    @Request() req: AuthenticatedRequest,
    @Param('carId', ParseIntPipe) id: number,
  ) {
    verifyAccess(req.user, userId)
    return this.carsService.delete(userId, id)
  }
}

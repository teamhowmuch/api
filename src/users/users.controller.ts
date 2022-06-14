import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common'

import { UsersService } from './users.service'
import { AuthenticatedRequest, JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Roles } from 'src/auth/roles.decorator'
import { RoleEnum as Role } from 'src/entities/UserRole'
import { RolesGuard } from 'src/auth/roles.guard'
import { IsBoolean, IsObject, IsOptional, IsString } from 'class-validator'
import { verifyAccess } from 'src/auth/verifyAccess'

class PatchUserDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsObject()
  onboarding_data?: { [key: string]: any }

  @IsOptional()
  @IsObject()
  journey_data?: { [key: string]: any }

  @IsOptional()
  @IsBoolean()
  is_beta_tester?: boolean
}

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles(Role.ADMIN)
  getUsers() {
    return this.userService.find({ loadRelationIds: true })
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':userId')
  @Roles(Role.ADMIN)
  async getUser(@Param('userId', ParseIntPipe) userId: number) {
    const user = await this.userService.findOne({
      where: { id: userId },
      relations: ['bankConnections', 'cars', 'emissionEvents'],
    })

    return user
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':userId')
  async update(
    @Request() { user }: AuthenticatedRequest,
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: PatchUserDto,
  ) {
    verifyAccess(user, userId)
    const { name, onboarding_data, journey_data, is_beta_tester } = body
    await this.userService.update(userId, { name, onboarding_data, journey_data, is_beta_tester })
  }
}

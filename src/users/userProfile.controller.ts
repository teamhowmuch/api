import { Body, Controller, Get, HttpCode, Patch, Request, UseGuards } from '@nestjs/common'

import { UsersService } from './users.service'
import { AuthenticatedRequest, JwtAuthGuard } from '../auth/jwt-auth.guard'
import { IsOptional, IsString } from 'class-validator'

class PatchProfileDto {
  @IsOptional()
  @IsString()
  name?: string
}

@Controller('profile')
export class UserProfileController {
  constructor(private userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  get(@Request() req: AuthenticatedRequest) {
    const { user } = req
    return this.userService.findOne({ where: { id: user.id } })
  }

  @UseGuards(JwtAuthGuard)
  @Patch('')
  @HttpCode(204)
  async patch(@Body() body: PatchProfileDto, @Request() req: AuthenticatedRequest) {
    const { user } = req
    await this.userService.update(user.id, { name: body.name })
  }
}

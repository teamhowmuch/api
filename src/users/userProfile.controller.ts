import { Body, Controller, Get, HttpCode, Patch, Request, UseGuards } from '@nestjs/common'

import { UsersService } from './users.service'
import { AuthenticatedRequest, JwtAuthGuard } from '../auth/jwt-auth.guard'
import { IsBoolean, IsObject, IsOptional, IsString } from 'class-validator'

class PatchProfileDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsObject()
  onboarding_data?: { [key: string]: any }

  @IsOptional()
  @IsBoolean()
  is_beta_tester?: boolean
}

@Controller('profile')
export class UserProfileController {
  constructor(private userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  get(@Request() req: AuthenticatedRequest) {
    const { user } = req
    return this.userService.findOne({ where: { id: user.id }, loadRelationIds: true })
  }

  @UseGuards(JwtAuthGuard)
  @Patch('')
  @HttpCode(204)
  async patch(@Body() body: PatchProfileDto, @Request() req: AuthenticatedRequest) {
    const { user } = req
    const { name, onboarding_data, is_beta_tester } = body
    await this.userService.update(user.id, { name, onboarding_data, is_beta_tester })
  }
}

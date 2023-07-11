import { Body, Controller, Get, HttpCode, Patch, Post, Request, UseGuards } from '@nestjs/common'

import { UsersService } from './users.service'
import { AuthenticatedRequest, JwtAuthGuard } from '../auth/jwt-auth.guard'
import { IsBoolean, IsEmail, IsNumber, IsObject, IsOptional, IsString } from 'class-validator'

class PatchProfileDto {
  @IsOptional()
  @IsEmail()
  email_change_request?: string

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

  @IsOptional()
  @IsNumber()
  climate_score: number
}

class VerifyEmailDto {
  @IsString()
  otp: string
}

@Controller('profile')
export class UserProfileController {
  constructor(private userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  get(@Request() req: AuthenticatedRequest) {
    const { user } = req
    return this.userService.findOne({
      where: { id: user.id },
      loadRelationIds: true,
    })
  }

  @UseGuards(JwtAuthGuard)
  @Patch('')
  @HttpCode(204)
  async patch(@Body() body: PatchProfileDto, @Request() req: AuthenticatedRequest) {
    const { user } = req
    await this.userService.update(user.id, body)
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify-email')
  @HttpCode(204)
  async verifyEmailChange(@Body() { otp }: VerifyEmailDto, @Request() req: AuthenticatedRequest) {
    const { user } = req

    return await this.userService.confirmChangeEmailOtp(user.id, otp)
  }
}

import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { IsEmail, IsString } from 'class-validator'
import { AuthService } from './auth.service'
import { AuthenticatedRequest } from './jwt-auth.guard'

export class ReqOtpDto {
  @IsEmail()
  email: string
}

export class LoginDto {
  @IsEmail()
  email: string

  @IsString()
  otp: string
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req: AuthenticatedRequest) {
    return this.authService.login(req.user)
  }

  @Post('request-otp')
  async requestOTP(@Body() body: ReqOtpDto) {
    const { email } = body
    await this.authService.requestOtp(email)
    return
  }
}

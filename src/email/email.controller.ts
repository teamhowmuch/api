import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common'
import { IsDateString, IsEmail, IsOptional } from 'class-validator'
import { AuthenticatedRequest, JwtAuthGuard } from 'src/auth/jwt-auth.guard'

class SendReminderDto {
  @IsEmail()
  @IsOptional()
  email: string

  @IsDateString()
  schedule_at: Date
}

class ShareDto {
  @IsEmail()
  email: string
}

@Controller('email')
export class EmailController {
  @Post('reminder')
  @UseGuards(JwtAuthGuard)
  async reminder(@Req() req: AuthenticatedRequest, @Body() body: SendReminderDto) {
    console.log('req', req.user.email)
    console.log('body', body)
    return
  }

  @Post('share-partner')
  @UseGuards(JwtAuthGuard)
  async sharePartner(@Req() req: AuthenticatedRequest, @Body() body: ShareDto) {
    console.log('req', req.user.email)
    console.log('body', body)
    return
  }

  @Post('share')
  @UseGuards(JwtAuthGuard)
  async share(@Req() req: AuthenticatedRequest, @Body() body: ShareDto) {
    console.log('req', req.user.email)
    console.log('body', body)
    return
  }
}

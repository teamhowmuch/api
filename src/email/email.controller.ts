import { BadRequestException, Body, Controller, Post, Req, UseGuards } from '@nestjs/common'
import { IsEmail, IsOptional } from 'class-validator'
import { AuthenticatedRequest, JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { McService } from './mc/mc.service'

class SendReminderDto {
  @IsEmail()
  @IsOptional()
  email: string
}

class ShareDto {
  @IsEmail()
  email: string
}

@Controller('email')
export class EmailController {
  constructor(private mcService: McService) {}

  @Post('signup-november')
  async reminder(@Body() { email }: SendReminderDto) {
    try {
      await this.mcService.signupContact(email, ['november_health_2022'])
      return
    } catch (error) {
      throw new BadRequestException()
    }
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

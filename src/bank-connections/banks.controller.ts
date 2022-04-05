import { Controller, Get, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { BanksService } from './banks.service'

@Controller('banks')
export class BanksController {
  constructor(private banksService: BanksService) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  list() {
    return this.banksService.list()
  }
}

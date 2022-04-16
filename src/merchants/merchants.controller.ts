import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { IsString } from 'class-validator'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { MerchantsService } from './merchants.service'

class CreateDto {
  @IsString()
  name: string
}

@Controller('merchants')
export class MerchantsController {
  constructor(private merchantsService: MerchantsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: CreateDto) {
    const { name } = body
    return this.merchantsService.create(name)
  }
}

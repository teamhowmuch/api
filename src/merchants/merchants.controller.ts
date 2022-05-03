import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { IsNumber, IsString } from 'class-validator'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { MerchantsService } from './merchants.service'

class CreateDto {
  @IsString()
  name: string

  @IsNumber()
  category_id: number
}

@Controller('merchants')
export class MerchantsController {
  constructor(private merchantsService: MerchantsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: CreateDto) {
    const { name, category_id } = body
    return this.merchantsService.create(name, category_id)
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async list() {
    return this.merchantsService.list()
  }
}

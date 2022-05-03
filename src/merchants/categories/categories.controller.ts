import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { IsString } from 'class-validator'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { CategoriesService } from './categories.service'

class CreateDto {
  @IsString()
  name: string
}

@Controller('merchants/categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: CreateDto) {
    const { name } = body
    return this.categoriesService.create(name)
  }
}
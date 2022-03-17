import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common'

import { UsersService } from './users.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

interface CreateUserDto {
  email: string
}

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getUsers() {
    return this.userService.findAll()
  }

  @Post()
  create(@Body() { email }: CreateUserDto) {
    return this.userService.create({ email })
  }
}

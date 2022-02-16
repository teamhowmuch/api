import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { AuthenticatedRequest, JwtAuthGuard } from '../auth/jwt-auth.guard';

interface CreateUserDto {
  email: string;
}

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getUsers() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Request() req: AuthenticatedRequest) {
    const { user } = req;
    return this.userService.findOne({ id: user.id });
  }

  @Post()
  create(@Body() { email }: CreateUserDto) {
    return this.userService.create({ email });
  }
}

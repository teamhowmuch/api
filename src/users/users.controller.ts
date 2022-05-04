import { Controller, Get, UseGuards } from '@nestjs/common'

import { UsersService } from './users.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Roles } from 'src/auth/roles.decorator'
import { RoleEnum as Role } from 'src/entities/UserRole'
import { RolesGuard } from 'src/auth/roles.guard'

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles(Role.ADMIN)
  getUsers() {
    return this.userService.find({ loadRelationIds: true })
  }
}

import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common'
import { AuthenticatedRequest, JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { Roles } from 'src/auth/roles.decorator'
import { RolesGuard } from 'src/auth/roles.guard'
import { AnyObject } from 'src/entities/User'
import { RoleEnum } from 'src/entities/UserRole'
import { ChatsService } from './chats.service'

@Controller('chats')
export class ChatsController {
  constructor(private chatsService: ChatsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Request() { user }: AuthenticatedRequest, @Body() body: AnyObject) {
    this.chatsService.create(user.id, body)
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async list() {
    this.chatsService.list()
  }
}

import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { Roles } from 'src/auth/roles.decorator'
import { RolesGuard } from 'src/auth/roles.guard'

import { RoleEnum } from 'src/entities/UserRole'
import { CreateChatDto } from './ChatDto'
import { ChatsService } from './chats.service'

@Controller('chats')
export class ChatsController {
  constructor(private chatsService: ChatsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() body: CreateChatDto) {
    return this.chatsService.create(body)
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.chatsService.getById(id)
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async list() {
    this.chatsService.list()
  }
}

import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { Roles } from 'src/auth/roles.decorator'
import { RolesGuard } from 'src/auth/roles.guard'
import { McService } from 'src/email/mc/mc.service'

import { RoleEnum } from 'src/entities/UserRole'
import { CreateChatDto } from './ChatDto'
import { ChatsService } from './chats.service'

@Controller('chats')
export class ChatsController {
  constructor(private chatsService: ChatsService, private mcService: McService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() body: CreateChatDto) {
    const res = await this.chatsService.create(body)
    if (res.data && res.data.email) {
      console.log('adding contact?', res.data.email)
      await this.mcService.signupContact(res.data.email)
    }
    return res
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

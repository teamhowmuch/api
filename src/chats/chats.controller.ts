import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { AnyObject } from 'src/entities/User'
import { ChatsService } from './chats.service'

@Controller('chats')
export class ChatsController {
  constructor(private chatsService: ChatsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() body: AnyObject) {
    console.log('RECEIVED REQUEST WITH DATA', body)
    this.chatsService.create(body)
  }
}

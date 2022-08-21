import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EmailModule } from 'src/email/email.module'
import { UserChat } from 'src/entities/UserChat'
import { UsersModule } from 'src/users/users.module'
import { ChatsController } from './chats.controller'
import { ChatsService } from './chats.service'

@Module({
  imports: [TypeOrmModule.forFeature([UserChat]), UsersModule, EmailModule],
  controllers: [ChatsController],
  providers: [ChatsService],
})
export class ChatsModule {}

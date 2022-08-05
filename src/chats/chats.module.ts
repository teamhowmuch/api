import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserChat } from 'src/entities/UserChat'
import { ChatsController } from './chats.controller'
import { ChatsService } from './chats.service'

@Module({
  imports: [TypeOrmModule.forFeature([UserChat])],
  controllers: [ChatsController],
  providers: [ChatsService],
})
export class ChatsModule {}

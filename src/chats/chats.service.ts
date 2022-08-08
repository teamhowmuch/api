import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/entities/User'
import { UserChat } from 'src/entities/UserChat'
import { Repository } from 'typeorm'

@Injectable()
export class ChatsService {
  constructor(@InjectRepository(UserChat) private userChatRepo: Repository<UserChat>) {}

  async create(userId: User['id'], data: any) {
    const newChat = new UserChat()
    newChat.user_id = userId
    newChat.data = data
    return this.userChatRepo.save(newChat)
  }

  async getById(id: string) {
    return this.userChatRepo.find({ where: { id } })
  }

  async list() {
    return this.userChatRepo.find()
  }
}

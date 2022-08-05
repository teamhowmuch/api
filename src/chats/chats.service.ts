import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserChat } from 'src/entities/UserChat'
import { Repository } from 'typeorm'

@Injectable()
export class ChatsService {
  constructor(@InjectRepository(UserChat) private userChatRepo: Repository<UserChat>) {}

  async create(data: any) {
    console.log('should now create stuff', data)
  }
}

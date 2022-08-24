import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EmailService } from 'src/email/email.service'
import { UserChat } from 'src/entities/UserChat'
import { UsersService } from 'src/users/users.service'
import { Repository } from 'typeorm'
import { CreateChatDto } from './ChatDto'

@Injectable()
export class ChatsService {
  private readonly logger = new Logger(ChatsService.name)

  constructor(
    @InjectRepository(UserChat) private userChatRepo: Repository<UserChat>,
    private userService: UsersService,
    private emailService: EmailService,
  ) {}

  async create(data: CreateChatDto) {
    let user
    if (data.email) {
      user = await this.userService.createOrFind({ email: data.email })
    } else {
      user = await this.userService.create({ email: `anonymous-${data.chat_id}@howmuch.how` })
    }
    const newChat = new UserChat()
    newChat.user_id = user.id
    newChat.data = data
    await this.userChatRepo.save(newChat)

    try {
      await this.emailService.sendEmail(data.email, 'chatResults', { chat_uuid: newChat.id })
    } catch (error) {
      this.logger.error(`Caught error while sending email to ${data.email}`)
    }
    return newChat
  }

  async getById(id: string) {
    return this.userChatRepo.findOne({ where: { id } })
  }

  async list() {
    return this.userChatRepo.find()
  }
}

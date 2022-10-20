import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EmailService } from 'src/email/email.service'
import { UserChat } from 'src/entities/UserChat'
import { UsersService } from 'src/users/users.service'
import { Repository } from 'typeorm'
import { CreateChatDto } from './ChatDto'
import { randomBytes } from 'crypto'

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
    console.log('creating chat for email:', data.email)
    if (data.email) {
      user = await this.userService.createOrFind({ email: data.email })
    } else {
      user = await this.userService.create({
        email: `anonymous-${randomBytes(8).toString('hex')}@howmuch.how`,
      })
    }
    const newChat = new UserChat()
    newChat.user_id = user.id
    newChat.data = data
    await this.userChatRepo.save(newChat)

    if (data.email) {
      try {
        await this.emailService.sendEmail(data.email, 'chatResults', { chat_uuid: newChat.id })
      } catch (error) {
        this.logger.error(`Caught error while sending email to ${data.email}`)
      }
    }

    user.equality_score = data.values.gender_equality
    user.fair_pay_score = data.values.fair_pay
    user.climate_score = data.values.climate
    user.anti_weapons_score = data.values.gender_equality
    user.animal_score = data.values.animal_welfare
    user.nature_score = data.values.biodiversity
    user.anti_tax_avoidance_score = data.values.tax_evasion_sucks

    await this.userService.update(user.id, user)

    return newChat
  }

  async getById(id: string) {
    return this.userChatRepo.findOne({ where: { id } })
  }

  async list() {
    return this.userChatRepo.find()
  }
}

import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { RoleEnum } from '../entities/UserRole'
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm'
import { User } from '../entities/User'
import { RolesService } from './roles.service'
import { generatePin } from 'src/auth/util'
import { notify } from 'node-notifier'
import { EmailService } from 'src/email/email.service'
import { compare } from 'bcryptjs'

import { differenceInMinutes, differenceInSeconds } from 'date-fns'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private rolesService: RolesService,
    private emailService: EmailService,
  ) {}

  find(options: FindManyOptions): Promise<User[]> {
    return this.userRepository.find(options)
  }

  async findOne(options: FindOneOptions<User>): Promise<User> {
    const res = await this.userRepository.findOne(options)
    return res
  }

  async createOrFind({ email }: Pick<User, 'email'>): Promise<User> {
    const found = await this.findOne({ where: { email } })
    if (found) {
      return found
    } else {
      return this.create({ email })
    }
  }

  async create({ email, name }: Pick<User, 'email'> & Partial<User>): Promise<User> {
    const exists = await this.userRepository.findOne({ where: { email } })
    if (exists) {
      throw new ConflictException('User with that email exists')
    }

    const user = new User()
    user.email = email
    user.name = name

    const res = await this.userRepository.save(user)
    await this.rolesService.assign(res.id, RoleEnum.USER)

    // TODO 20220808 Ugly hack alert and security risk
    // Assign Daan and Bot roles
    if (email === 'daanaerts@gmail.com' || email === 'daan@howmuch.how') {
      await this.rolesService.assign(res.id, RoleEnum.ADMIN)
    }
    if (email === 'bot@howmuch.how') {
      await this.rolesService.assign(res.id, RoleEnum.CHATBOT)
    }
    return res
  }

  async sendChangeEmailOtp(email: string): Promise<string> {
    const { pin, hashed } = await generatePin()

    if (process.env.SEND_AUTH_EMAILS === 'false') {
      notify(`Your change email OTP is ${pin}`)
      console.log('Your change email OTP is', pin)
    } else {
      this.emailService.sendChangeEmailOtp(email, pin)
    }

    return hashed
  }

  async confirmChangeEmailOtp(userId: number, otp: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    if (!user.email_change_request) {
      throw new UnauthorizedException('Bad OTP')
    }

    if (differenceInMinutes(new Date(), user.email_change_request_at) > 5) {
      throw new UnauthorizedException('OTP expired')
    }

    const compareResult = await compare(otp, user.email_change_request_otp)
    if (compareResult) {
      user.email = user.email_change_request
      user.email_change_request = null
      user.email_change_request_at = null
      user.email_change_request_otp = null
      await this.userRepository.save(user)
      return { success: true }
    } else {
      throw new UnauthorizedException('Bad OTP')
    }
  }

  async update(userId: number, fields: Partial<User>) {
    const user = await this.userRepository.findOne({ where: { id: userId } })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    if (fields.email_change_request && fields.email_change_request !== user.email) {
      const userWithEmailExists = await this.userRepository.findOne({
        where: { email: fields.email_change_request },
      })
      if (userWithEmailExists) {
        throw new ConflictException(`Email exists`)
      }
      user.email_change_request = fields.email_change_request
      user.email_change_request_at = new Date()
      user.email_change_request_otp = await this.sendChangeEmailOtp(fields.email_change_request)
    }

    if (fields.name) user.name = fields.name
    if (fields.onboarding_data) {
      user.onboarding_data = { ...user.onboarding_data, ...fields.onboarding_data }
    }
    if (fields.journey_data) {
      user.journey_data = { ...user.journey_data, ...fields.journey_data }
    }
    if (typeof fields.is_beta_tester !== 'undefined') {
      user.is_beta_tester = fields.is_beta_tester
    }

    if (fields.equality_score) user.equality_score = fields.equality_score
    if (fields.fair_pay_score) user.fair_pay_score = fields.fair_pay_score
    if (fields.climate_score) user.climate_score = fields.climate_score
    if (fields.anti_weapons_score) user.anti_weapons_score = fields.anti_weapons_score
    if (fields.animal_score) user.animal_score = fields.animal_score
    if (fields.nature_score) user.nature_score = fields.nature_score
    if (fields.anti_tax_avoidance_score)
      user.anti_tax_avoidance_score = fields.anti_tax_avoidance_score

    await this.userRepository.save(user)
  }
}

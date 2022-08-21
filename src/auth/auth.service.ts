import { Injectable } from '@nestjs/common'
import { User } from 'src/entities/User'
import { UsersService } from 'src/users/users.service'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserOtp } from 'src/entities/UserOtp'
import { generatePin } from './util'
import { compare } from 'bcryptjs'
import { notify } from 'node-notifier'
import { EmailService } from '../email/email.service'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(UserOtp)
    private userOtpRepository: Repository<UserOtp>,
    private emailService: EmailService,
  ) {}

  private async createNewOtp(user: User): Promise<{ otp: string }> {
    let userOtp = await this.userOtpRepository.findOne({ where: { user_id: user.id } })

    if (!userOtp) {
      userOtp = new UserOtp()
    }

    const { pin, hashed } = await generatePin()
    userOtp.otp_hashed = hashed
    userOtp.user_id = user.id
    userOtp.used = false
    await this.userOtpRepository.save(userOtp)

    return { otp: pin }
  }

  private async sendOtp(email: string, otp: string): Promise<void> {
    if (process.env.SEND_AUTH_EMAILS === 'false') {
      notify(`Your OTP is ${otp}`)
      console.log('Your OTP is', otp)
      return
    }

    this.emailService.sendOtp(email, otp)
  }

  async requestOtp(emailRaw: string): Promise<{ otp: string }> {
    const email = emailRaw.toLowerCase()
    const user = await this.usersService.findOne({ where: { email: email.toLowerCase() } })
    if (user) {
      const { otp } = await this.createNewOtp(user)
      await this.sendOtp(email, otp)
      return
    } else {
      const newUser = await this.usersService.create({ email })
      const { otp } = await this.createNewOtp(newUser)
      await this.sendOtp(email, otp)
    }
  }

  async validateLoginRequest(emailRaw: string, userEnteredOtp: string): Promise<User> {
    const email = emailRaw.toLowerCase()
    const user = await this.usersService.findOne({ where: { email }, relations: ['roles'] })
    if (!user) {
      return null
    }

    if (user.roles.some((role) => role.role === 'CHATBOT')) {
      if (process.env.CHATBOT_PASSWORD && userEnteredOtp === process.env.CHATBOT_PASSWORD) {
        return user
      } else {
        return null
      }
    }

    const storedOtp = await this.userOtpRepository.findOne({ where: { user_id: user.id } })

    if (storedOtp) {
      const compared = await compare(userEnteredOtp, storedOtp.otp_hashed)
      if (compared && storedOtp.used === false) {
        storedOtp.used = true
        await this.userOtpRepository.save(storedOtp)
        return user
      } else {
        return null
      }
    } else {
      return null
    }
  }

  async login({ email: emailRaw, id }: { email: string; id: number }) {
    const email = emailRaw.toLowerCase()
    const dbUser = await this.usersService.findOne({ where: { id }, loadRelationIds: true })
    const payload = { email: email, sub: id, roles: dbUser.roles }
    return {
      access_token: this.jwtService.sign(payload),
      user: dbUser,
    }
  }
}

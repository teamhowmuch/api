import { Injectable } from '@nestjs/common'
import { User } from 'src/entities/User'
import { UsersService } from 'src/users/users.service'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserOtp } from 'src/entities/UserOtp'
import { generatePin } from './otp'
import { compare } from 'bcrypt'
import { notify } from 'node-notifier'
import { MailService } from './mail.service'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(UserOtp)
    private userOtpRepository: Repository<UserOtp>,
    private mailService: MailService,
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

    this.mailService.sendOtp(email, otp)
  }

  async requestOtp(email: string): Promise<{ otp: string }> {
    const user = await this.usersService.findOne({ where: { email } })
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

  async validateLoginRequest(email: string, userEnteredOtp: string): Promise<User> {
    const user = await this.usersService.findOne({ where: { email } })
    if (!user) {
      return null
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

  async login(user: { email: string; id: number }) {
    const payload = { email: user.email, sub: user.id }
    const dbUser = await this.usersService.findOne({ where: { id: user.id } })
    return {
      access_token: this.jwtService.sign(payload),
      user: dbUser,
    }
  }
}

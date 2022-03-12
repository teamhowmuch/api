import { Injectable, NotFoundException } from '@nestjs/common'
import { User } from 'src/entities/User'
import { UsersService } from 'src/users/users.service'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserOtp } from 'src/entities/UserOtp'
import { generatePin, hashOtp } from './otp'
import { subMinutes } from 'date-fns'
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
    private mailService: MailService
  ) {}

  private async createNewOtp(user: User): Promise<{ otp: string }> {
    let userOtp = await this.userOtpRepository.findOne({ user: user })

    if (!userOtp) {
      userOtp = new UserOtp()
    }

    const { pin, hashed } = await generatePin()
    userOtp.otp_hashed = hashed
    userOtp.user = user
    userOtp.used = false
    await this.userOtpRepository.save(userOtp)

    return { otp: pin }
  }

  private async sendOtp(email: string, otp: string): Promise<void> {
    notify(`Your OTP is ${otp}`)
    // this.mailService.sendOtp(email, otp)
    console.log('Your OTP is', otp)
  }

  async requestOtp(email: string): Promise<{ otp: string }> {
    const user = await this.usersService.findOne({ email })
    if (user) {
      const { otp } = await this.createNewOtp(user)
      await this.sendOtp(email, otp)
      return
    } else {
      throw new NotFoundException(`user with email ${email} not found`)
    }
  }

  async validateLoginRequest(
    email: string,
    userEnteredOtp: string,
  ): Promise<User> {
    const user = await this.usersService.findOne({ email })
    if (!user) {
      return null
    }

    const otpValidAfter = subMinutes(new Date(), 3000)
    const storedOtp = await this.userOtpRepository.findOne({ user })

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

  async login(user: any) {
    const payload = { email: user.email, sub: user.id }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }
}

import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { UsersModule } from 'src/users/users.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { LocalStrategy } from './local.strategy'
import { jwtConstants } from './auth.constants'
import { JwtStrategy } from './jwt.strategy'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserOtp } from 'src/entities/UserOtp'
import { MailService } from './mail.service'

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([UserOtp]),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '30d' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, MailService],
  controllers: [AuthController],
})
export class AuthModule {}

import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { UsersModule } from 'src/users/users.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { LocalStrategy } from './local.strategy'
import { JwtStrategy } from './jwt.strategy'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserOtp } from 'src/entities/UserOtp'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { UserRole } from 'src/entities/UserRole'
import { User } from 'src/entities/User'
import { EmailModule } from 'src/email/email.module'

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    TypeOrmModule.forFeature([UserOtp, User, UserRole]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('jwtSecret'),
          signOptions: { expiresIn: '30d' },
        }
      },
      inject: [ConfigService],
    }),
    EmailModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersController } from './users.controller'
import { User } from '../entities/User'
import { UsersService } from './users.service'
import { UserProfileController } from './userProfile.controller'
import { UserRole } from 'src/entities/UserRole'
import { RolesService } from './roles.service'

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRole])],
  providers: [UsersService, RolesService],
  controllers: [UsersController, UserProfileController],
  exports: [UsersService],
})
export class UsersModule {}

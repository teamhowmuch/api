import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { User } from '../entities/User';
import { UsersService } from './users.service';
import { UserProfileController } from './userProfile.controller';

@Module({
  imports    : [TypeOrmModule.forFeature([User])],
  providers  : [UsersService],
  controllers: [UsersController, UserProfileController],
  exports    : [UsersService],
})
export class UsersModule {}

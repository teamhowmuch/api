import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Car } from 'src/entities/Car'
import { UsersModule } from 'src/users/users.module'
import { UsersService } from 'src/users/users.service'
import { CarsController } from './cars.controller'
import { CarsService } from './cars.service'
import { OverheidService } from './overheid/overheid.service';

@Module({
  imports    : [TypeOrmModule.forFeature([Car]), UsersModule],
  controllers: [CarsController],
  providers  : [CarsService, OverheidService],
  exports    : [CarsService]
})
export class CarsModule {}

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AirportsModule } from 'src/airports/airports.module'
import { Flight } from 'src/entities/Flight'
import { FlightsController } from './flights.controller'
import { FlightsService } from './flights.service'
import { UsersFlightsController } from './users-flights.controller'

@Module({
  imports: [AirportsModule, TypeOrmModule.forFeature([Flight])],
  controllers: [FlightsController, UsersFlightsController],
  providers: [FlightsService],
})
export class FlightsModule {}

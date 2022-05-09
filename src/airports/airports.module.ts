import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Airport } from 'src/entities/Airport'
import { AirportsController } from './airports.controller'
import { AirportsService } from './airports.service'

@Module({
  controllers: [AirportsController],
  imports: [TypeOrmModule.forFeature([Airport])],
  providers: [AirportsService],
  exports: [AirportsService],
})
export class AirportsModule {}

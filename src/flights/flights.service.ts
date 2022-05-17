import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AirportsService } from 'src/airports/airports.service'
import { Flight } from 'src/entities/Flight'
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm'
import { CreateFlightDto } from './models'
import { calcDistanceCrow } from './utils'

@Injectable()
export class FlightsService {
  constructor(
    @InjectRepository(Flight) private flightsRepo: Repository<Flight>,
    private airportsService: AirportsService,
  ) {}

  async find(options: FindManyOptions<Flight>) {
    return this.flightsRepo.find(options)
  }

  async findOne(options: FindOneOptions<Flight>) {
    return this.flightsRepo.find(options)
  }

  async create(
    userId: number,
    {
      from_airport_id,
      to_airport_id,
      purchased_at,
      fare,
      ticket_count,
      merchant_id,
      amount_paid_eur,
    }: CreateFlightDto,
  ) {
    const fromAirport = await this.airportsService.findOne(from_airport_id)
    if (!fromAirport) throw new NotFoundException(`Invalid from_airport_id: ${from_airport_id}`)
    const toAirport = await this.airportsService.findOne(to_airport_id)
    if (!toAirport) throw new NotFoundException(`Invalid to_airport_id: ${to_airport_id}`)

    const newFlight = new Flight()
    newFlight.user_id = userId
    newFlight.from_airport_id = from_airport_id
    newFlight.to_airport_id = to_airport_id
    newFlight.purchased_at = purchased_at
    newFlight.fare = fare
    newFlight.ticket_count = ticket_count
    newFlight.merchant_id = merchant_id
    newFlight.amount_paid_eur = amount_paid_eur

    newFlight.distance = Math.round(
      calcDistanceCrow(
        { lat: fromAirport.lat, long: fromAirport.long },
        { lat: toAirport.lat, long: toAirport.long },
      ),
    )

    const res = this.flightsRepo.save(newFlight)
    return res
  }
}

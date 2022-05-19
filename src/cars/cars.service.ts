import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { format } from 'date-fns'
import { Car } from '../entities/Car'
import { UsersService } from '../users/users.service'
import { Repository } from 'typeorm'
import { OverheidService } from './overheid/overheid.service'

import { FuelType } from '../products/carfuel/carfuel.service'

function normalizeCarFuel(carFuelRaw: string): FuelType {
  const c = carFuelRaw.toLowerCase()
  if (c.includes('benzine')) {
    return FuelType.PETROL
  } else if (c.includes('diesel')) {
    return FuelType.DIESEL
  } else if (c.includes('lpg')) {
    return FuelType.LPG
  } else if (c.includes('elektriciteit')) {
    return FuelType.ELECTRIC
  } else {
    return FuelType.OTHER
  }
}

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car) private carRepo: Repository<Car>,
    private overheidService: OverheidService,
    private usersService: UsersService,
  ) {}

  async lookup(licensePlate: string) {
    try {
      const data = await this.overheidService.lookupLicensePlate(licensePlate)
      const car = new Car()
      car.license_plate = licensePlate
      car.brand = data.merk
      car.type = data.handelsbenaming
      car.fuel_types = data.brandstof.map((e) => e.brandstof_omschrijving).join('+')
      car.fuel_type_simplified = normalizeCarFuel(car.fuel_types)
      car.raw_data = data
      car.build_year = format(new Date(data.datum_eerste_tenaamstelling_in_nederland_dt), 'yyyy')
      car.last_change_of_ownership = new Date(data.datum_tenaamstelling_dt)
      return car
    } catch (error) {
      console.log(error)
      if ('response' in error && error.response.status === 404) {
        throw new NotFoundException(`No car exists with license plate ${licensePlate}`)
      }
    }
  }

  async create(userId: number, licensePlate: string) {
    const user = await this.usersService.findOne({ where: { id: userId } })
    if (!user) {
      throw new NotFoundException(`User does not exist`)
    }

    let car = await this.carRepo.findOne({
      where: { license_plate: licensePlate, user_id: userId },
    })
    try {
      const data = await this.overheidService.lookupLicensePlate(licensePlate)
      car = car || new Car()
      car.license_plate = licensePlate
      car.user_id = userId
      car.brand = data.merk
      car.raw_data = data
      car.type = data.handelsbenaming
      car.fuel_types = data.brandstof.map((e) => e.brandstof_omschrijving).join('+')
      car.fuel_type_simplified = normalizeCarFuel(car.fuel_types)
      car.build_year = format(new Date(data.datum_eerste_toelating_dt), 'yyyy')
      car.last_change_of_ownership = new Date(data.datum_tenaamstelling_dt)

      const res = this.carRepo.save(car)
      return res
    } catch (error) {
      console.log(error)
      if ('response' in error && error.response.status === 404) {
        throw new NotFoundException(`No car exists with license plate ${licensePlate}`)
      } else {
        throw error
      }
    }
  }

  async list(userId: number) {
    return this.carRepo.find({ where: { user_id: userId } })
  }

  async get(userId: number, carId: number) {
    const res = await this.carRepo.findOne({ where: { id: carId, user_id: userId } })
    if (!res) {
      return new NotFoundException(`No car with id ${carId} found`)
    }
    return res
  }

  async delete(userId: number, carId: number) {
    const car = await this.get(userId, carId)
    if (car) {
      await this.carRepo.delete(carId)
    }
  }
}

import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Airport } from 'src/entities/Airport'
import { ILike, Repository } from 'typeorm'
import { ImportAirports } from './import-airports'

@Injectable()
export class AirportsService {
  private logger = new Logger(AirportsService.name)
  constructor(@InjectRepository(Airport) private airportRepo: Repository<Airport>) {}

  async updateAirports() {
    const airports = await ImportAirports.download()

    this.logger.log('starting import of airports. will take a while. usually around 30-60s')
    let count = 0
    for (const importedAirport of airports) {
      if (importedAirport.iata_code) {
        const airport = new Airport()
        airport.country_code_iso_2 = importedAirport.iso_country
        airport.iata_id = importedAirport.iata_code
        const [long, lat] = importedAirport.coordinates.split(',').map((e) => Number(e.trim()))
        airport.lat = lat
        airport.long = long
        airport.name = importedAirport.name
        await this.airportRepo.save(airport)
        count++
      }
    }
    this.logger.log(`imported ${count} airports`)
  }

  async findByName(name: string) {
    return this.airportRepo.find({ name: ILike(`%${name}%`) })
  }

  async findOne(iataId: string) {
    return this.airportRepo.findOne(iataId)
  }
}
